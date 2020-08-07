from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework import permissions

from accounts.serializers import RegistrationSerializer, OrderItemSerializer, OrderSerializer
from accounts.models import User, Order, OrderItem

from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.shortcuts import render
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.urls import reverse
from django.core.validators import validate_email, ValidationError

import xmltodict
import requests
from datetime import datetime


API_QUERY_URL = 'https://apiquerysandbox.cieloecommerce.cielo.com.br'
API_REQUEST_URL = 'https://apisandbox.cieloecommerce.cielo.com.br'
headers = {
  'MerchantId': 'f85e7e0a-02c2-4b33-963a-61ecbe07bee0',
  'MerchantKey': 'EKSYGQONRNIZLJENWACZAUSTJNSHWLUSUHQYNMSA',
  'Content-Type': 'application/json'
}


class Send_Email(APIView):
  def post(self, request):
    message = request.POST.get('message')
    receiver = request.POST.get('receiver')
    title = request.POST.get('title')
    try:
      send_mail('title', message, settings.EMAIL_HOST_USER, [receiver] , fail_silently=False)
      Response({'Success': 'email enviado'})
    except:
      Response({'Failed': 'email nao enviado'})
    

class Registration_View(APIView):
  permission_classes = [permissions.AllowAny]

  def post(self, request):
    serializer = RegistrationSerializer(data=request.data)
    data = {}
    if serializer.is_valid():
      user = serializer.save()
      data['response'] = "Seu novo usuário foi criado com sucesso"
      data['email'] = user.email

      

      token = Token.objects.get(user=user).key
      data['token'] = token
      return Response(data, status=status.HTTP_201_CREATED)
    else:
      data = serializer.errors
      return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
    

class Get_User_Data(APIView):
  '''Necessário enviar token como header'''
  '''Authorization: Token <token>'''

  def validate_email_update(self, email):
    try:
      validate_email(email)
      return True
    except ValidationError:
      return False

  def validate_name_update(self, name):
    return not any(char.isdigit() for char in name)

  def validate_celular_update(self, celular):

    if any(not char.isdigit() for char in celular):
      return False
    if len(celular) != 9:
      return False
    return True

  def validate_numero_update(self, numero):
    if any(not char.isdigit() for char in numero):
      return False
    return True

  def validate_CEP_update(self, CEP):
    if any(not char.isdigit() for char in CEP):
      return False
    if len(CEP) != 8:
      return False
    return True

  def validate_endereco_update(self, endereco):
    return True

  def get(self, request):
    token = request.headers.get('Authorization').split(' ')[1]

    if not Token.objects.filter(key=token).exists():
      return Response({'Erro':'Token inválido'}, status=status.HTTP_403_FORBIDDEN)

    user = Token.objects.get(key=token).user

    context = {
      'id' : user.pk, 
      'nome': user.nome,
      'sobrenome': user.sobrenome,
      'email': user.email,
      'bairro': user.bairro,
      'cep': user.cep,
      'endereco': user.endereco,
      'numero': user.numero,
      'complemento': user.complemento,
      'celular': user.celular,
    }

    return Response(context, status=status.HTTP_200_OK)


  def post(self, request):
    token = request.headers.get('Authorization').split(' ')[1]

    if not Token.objects.filter(key=token).exists():
      return Response({'Erro':'Token inválido'}, status=status.HTTP_403_FORBIDDEN)

    user = Token.objects.get(key=token).user
    field = request.data.get('field')
    value = request.data.get('value')
    options = {
      'email': self.validate_email_update,
      'nome': self.validate_name_update,
      'sobrenome': self.validate_name_update,
      'celular': self.validate_celular_update,
      'endereco': self.validate_endereco_update,
      'numero': self.validate_numero_update,
      'complemento': self.validate_endereco_update,
      'cep': self.validate_CEP_update,
      'bairro': self.validate_name_update,
    }

    if options[field](value):
      setattr(user, field, value)
      user.save()
      return Response({'Sucesso': '{} alterado para {}'.format(field, value)}, status=status.HTTP_202_ACCEPTED)
    else:
      return Response({'Erro': '{} não pode ser alterado para {}'.format(field, value)}, status=status.HTTP_406_NOT_ACCEPTABLE)


class Update_User_Data(APIView):
  def post(self, request):
    token = request.headers.get('Authorization').split(' ')[1]

    if not Token.objects.filter(key=token).exists():
      return Response({'Erro':'Token inválido'}, status=status.HTTP_403_FORBIDDEN)
    
    user = Token.objects.get(key=token).user
  
    data = {}
    fields = ['endereco', 'numero', 'complemento', 'bairro', 'cep']
  
    for attr in fields:
      setattr(user, attr, request.data.get(attr))
    
    user.save()

    return Response({'sucesso': 'seu endereço foi atualizado'}, status=status.HTTP_202_ACCEPTED)
    

class Get_User_Orders(APIView):
  def get(self, request):
    token = request.headers.get('Authorization').split(' ')[1]


    if not Token.objects.filter(key=token).exists():
      return Response({'Erro':'Token inválido'}, status=status.HTTP_403_FORBIDDEN)

    user = Token.objects.get(key=token).user
    order = Order.objects.filter(customer=user.pk)
    serializer = OrderSerializer(order, many=True)
    

    return Response(serializer.data, status=status.HTTP_200_OK)


class Get_User_Orders_Items(APIView):
  def get(self, request):
    token = request.headers.get('Authorization').split(' ')[1]

    if not Token.objects.filter(key=token).exists():
      return Response({'Erro':'Token inválido'}, status=status.HTTP_403_FORBIDDEN)

    trans_id = request.GET.get('transaction_id')
    order = Order.objects.get(transaction_id=trans_id)
    # user = Token.objects.get(key=token).user
    # order = Order.objects.filter(user=user.pk)
    order_item = OrderItem.objects.filter(order=order)
    serializer = OrderItemSerializer(order_item, many=True)
    
    

    return Response(serializer.data, status=status.HTTP_200_OK)


  # class Create_Checkout_Session(APIView):
  #   def get(self, request):
  #     token = request.headers.get('Authorization').split(' ')[1]
  #     if not Token.objects.filter(key=token).exists():
  #       return Response({'Erro':'Token inválido'}, status=status.HTTP_403_FORBIDDEN)

  #     # sandbox
  #     url = 'https://ws.sandbox.pagseguro.uol.com.br/v2/sessions'
  #     params = {
  #       'token':'400296E6964B427198EBA0B26E328D8A',
  #       'email': 'bmartinsricardo@gmail.com',
  #       }
  #     response = requests.post(url, params=params)
  #     response.encoding = 'ISO-8859-1'
  #     session_id = xmltodict.parse(response.content).get('session').get('id')


  #     return Response({'id': session_id}, status=status.HTTP_201_CREATED)

class BinQuery(APIView):

  def get(self, request):
    
    card_bin = request.GET.get('cardBin')
      
    response = requests.get(API_QUERY_URL+'/1/cardBin/'+ str(card_bin), headers=headers)
    if response.status_code == 200:
      return Response(response.json(), status=status.HTTP_200_OK)
    else:
      return Response(response.json(), status=response.status_code)


class ZeroAuth(APIView):
  def post(self, request):
    
    payload = {
      "CardType": "CreditCard",
      "CardNumber": request.POST.get('cardNumber'),
      "Holder": request.POST.get('cardHolder'),
      "ExpirationDate": request.POST.get('expirationDate'),
      "SecurityCode":request.POST.get('securityCode'),
      "SaveCard":"false",
      "Brand": request.POST.get('brand')
    }


    response = requests.post(API_REQUEST_URL + '/1/zeroauth', data=payload, headers=headers)
    
    return Response(response.json(), status=response.status_code)


class Payment(APIView):

  def post(self, request):



    response = requests.post(API_REQUEST_URL + '/1/sales/', data=request.POST, headers=headers)
    return Response(request.POST)



class Create_Order_Item(APIView):

  def post(self, request):

    token = request.headers.get('Authorization').split(' ')[1]
    user = Token.objects.get(key=token).user

    data = {}
    order_data = request.data.get('orderObject')
    order_data['delivery_date'] = datetime.strptime(order_data['delivery_date'], '%d/%m/%Y').strftime("%Y-%m-%d")
    order_data['order_date'] = datetime.strptime(order_data['order_date'], '%d/%m/%Y').strftime("%Y-%m-%d")
    serializer = OrderSerializer(data=order_data)
    order_save = True
    item_save = True
    
    if serializer.is_valid():
      serializer.save()
      data = {'success': 'sucesso'}
    else:
      data['mensagens de erro'] = serializer.error_messages
      data['errors'] = serializer.errors
      order_save = False

    order = Order.objects.filter(transaction_id=order_data['transaction_id'])[0]
    for item in request.data.get('cartItems'):
      print(item)
      recheio = [rech[0] for rech in item.get('recheio') if rech]
      recheios = ' - '.join(recheio)
      item['recheio'] = recheios
      item['order'] = order.pk
      try:
        item['cobertura'] = item['cobertura'][0]
      except:
        item['cobertura'] = ""
      category_prices = {
        'Linha Premium - 15 cm': 80.00,
        'Linha Premium - 17 cm': 120.00,
        'Linha Premium - 20 cm': 160.00,
        'Linha Caseira - 24 cm': 45.00, 
      }
      itemPrice = category_prices[item['categoria']]
      if itemPrice == 45.00 and item['cobertura'] != "":
        itemPrice = 60.00
      item['itemPrice'] = itemPrice
      item_serializer = OrderItemSerializer(data=item)
      if item_serializer.is_valid():
        item_serializer.save()
        data['sucesso - ' + item.get("categoria")] = 'sucesso'
      else:
        print(item_serializer._errors)
        item_save = False
        data['mensagens de erro: cartItems - '  + item.get('categoria')] = serializer.error_messages
        data['errors: cartItems - ' + item.get('categoria')] = serializer.errors
    
    if order_save and item_save:
      message = '\n'.join([
        'Muito obrigado pelo seu pedido!',
        'Esperamos que aproveite ao máximo seu bolo!',
        'Não esqueça de compartilhar sua experiência com seus amigos e de nos seguir em nossas redes sociais!',
        'Seu pedido:',
        '    Data do Pedido: {}'.format(order_data['order_date']),
        '    Data de Entrega: {}'.format(order_data['delivery_date']),
        '    Preço: {}'.format(order_data['orderPrice']),

        'Atenciosamente,',
        'Equipe AMA BOLERIA.'])
      send_mail('Pedido Realizado!', message, settings.EMAIL_HOST_USER, [user.email] , fail_silently=False)
      return Response(data, status=status.HTTP_201_CREATED)
    else:
      return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
    