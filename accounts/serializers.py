from rest_framework import serializers
from .models import User, Order, OrderItem


class RegistrationSerializer(serializers.ModelSerializer):
  password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)

  class Meta:
    model = User
    fields = ['email', 'nome', 'sobrenome', 'password', 'password2']
    
    # para que não se possa ler a password durante a chamada do método
    extra_kwargs = {
      'password': {'write_only': True}
    }
  
  def save(self):
    user = User(
      email=self.validated_data['email'],
      nome=self.validated_data['nome'],
      sobrenome=self.validated_data['sobrenome'],
    )
    password = self.validated_data['password']
    password2 = self.validated_data['password2']

    if password != password2:
      raise serializers.ValidationError({'password': 'Senhas devem ser iguais'})
    
    user.set_password(password)
    user.save()
    return user


class OrderItemSerializer(serializers.ModelSerializer):
  class Meta:
    model = OrderItem
    fields = [
      'order',
      'categoria',
      'massa',
      'recheio',
      'cobertura',
      'itemPrice',
    ]
    extra_kwargs = {
      'itemPrice': {
        'required': False
      }}
    

class OrderSerializer(serializers.ModelSerializer):
  class Meta:
    model = Order
    fields = [
      'customer',
      'order_date',
      'delivery_date',
      'status',
      'transaction_id',
      'delivery_method',
      'orderPrice',
      'order_description',
      'bairro',
      'cep',
      'endereco',
      'complemento',
      'numero',
    ]

    extra_kwargs = {
      'complemento': {'required': False},
      'numero': {'required': False},
      'endereco': {'required': False},
      'cep': {'required': False},
      'bairro': {'required': False},
      'order_description': {'required': False},
    }

# class SingleFieldUserUpdateSerializer(serializers.ModelSerializer):
#   class Meta:
#     model = User
#     fields = [
#       'email',
#       'nome',
#       'sobrenome',
#       'celular',
#       'endereco',
#       'numero',
#       'complemento',
#       'CEP',
#       'bairro',
#     ]
#     extra_kwargs = {
#       'email': {'required': False},
#       'nome': {'required': False},
#       'sobrenome': {'required': False},
#       'celular': {'required': False},
#       'endereco': {'required': False},
#       'numero': {'required': False},
#       'complemento': {'required': False},
#       'CEP': {'required': False},
#       'bairro': {'required': False},
#     }
  
#   def update(self, validated_data):
