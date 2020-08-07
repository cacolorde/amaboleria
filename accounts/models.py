from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models.signals import post_save
from django.conf import settings
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from django.conf import settings

class CustomAccountManager(BaseUserManager):
  def create_user(self, email, nome, sobrenome, password=None):
    if not any((email, nome, sobrenome, password)):
      return "Você deve fornecer todos os dados requisitados"

    user = self.model(
      email=self.normalize_email(email),
      nome=nome,
      sobrenome=sobrenome,
    )
    user.set_password(password)
    user.save(using=self._db)
    return user

  def create_superuser(self, email, nome, sobrenome, password=None):
    if not any((email, nome, sobrenome, password)):
      return "Você deve fornecer todos os dados requisitados" 

    user = self.model(
      email=self.normalize_email(email),
      nome=nome,
      sobrenome=sobrenome,
    )
    user.set_password(password)
    user.is_admin = True
    user.is_staff = True
    user.is_superuser = True
    user.save(using=self._db)
    return user
    


class User(AbstractBaseUser):
  
  email = models.EmailField('Email', unique=True)
  nome = models.CharField('Nome', max_length=50)
  sobrenome = models.CharField('Sobrenome', max_length=100)
  password = models.CharField('Senha', max_length=128)
  
  bairro = models.CharField('Bairro', max_length=50, blank=True)
  cep = models.CharField('CEP', max_length=8, blank=True)
  endereco = models.CharField('Endereço', max_length=200, blank=True)
  numero = models.IntegerField(blank=True, null=True)
  complemento = models.CharField('Complemento', max_length=50, blank=True)
  celular = models.CharField('Celular', max_length=11, blank=True)
  
  
  is_admin = models.BooleanField(default=False)
  is_active = models.BooleanField(default=True)
  is_staff = models.BooleanField(default=False)
  is_superuser = models.BooleanField(default=False)

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = [
    'nome',
    'sobrenome',
  ]

  objects = CustomAccountManager()


  def has_perm(self, perm, obj=None):
    return self.is_admin

  def has_module_perms(self, app_label):
    return True

  def __str__(self):
    return "{} - {}".format(self.email, self.nome_completo())

  def nome_completo(self):
    return self.nome + ' ' + self.sobrenome

  def endereco_completo(self):
    if not any(self.endereco, self.cep, self.bairro):
      return False
    return "{}\n{}\n{} {}".format(self.endereco, self.complemento, self.cep, self.bairro)


class Order(models.Model):
  status_choices = [
    ('Aguardando Pagamento','Aguardando Pagamento'),
    ('Efetuado - Confirmado','Efetuado - Confirmado'),
    ('Entregue - Finalizado','Entregue - Finalizado'),
  ]

  customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True) 

  order_date = models.DateField('Data do Pedido', auto_now=True)
  delivery_date = models.DateField('Data de Entrega', auto_now=False, auto_now_add=False)
 
  status = models.CharField(choices=status_choices, max_length=50)
  transaction_id = models.CharField(max_length=200, null=True)

  delivery_method = models.CharField('Meio de Entrega', max_length=200, default='Entrega')
  order_description = models.TextField('Observação', max_length=10000, null=True, blank=True)

  orderPrice = models.FloatField('Preço', blank=True, null=True)


  # Número da autorização, identico ao NSU.
  # nsu = models.CharField(max_length=6, blank=True, null=True)

  bairro = models.CharField('Bairro', max_length=50, blank=True)
  cep = models.CharField('CEP', max_length=8, blank=True)
  endereco = models.CharField('Endereço', max_length=200, blank=True)
  numero = models.IntegerField(blank=True, null=True)
  complemento = models.CharField('Complemento', max_length=50, blank=True)

  def __str__(self):
    return ('nº: {} ||\n Status: {} ||\n Data de Entrega: {}').format(self.transaction_id, self.status, self.order_date) 


class OrderItem(models.Model):
  category_choices= [
    ('Linha Premium - 15 cm','Linha Premium - 15 cm'),
    ('Linha Premium - 17 cm','Linha Premium - 17 cm'),
    ('Linha Premium - 20 cm','Linha Premium - 20 cm'),
    ('Linha Caseira - 24 cm', 'Linha Caseira - 24 cm'),
  ]

  order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)

  categoria = models.CharField(choices=category_choices, max_length=50)
  massa = models.CharField('Massa', max_length=50, null=False, blank=False)
  recheio = models.CharField('Recheio', max_length=100, null=False, blank=True)
  cobertura = models.CharField('Cobertura', max_length=50, null=False, blank=True)

  itemPrice = models.FloatField('Preço do Item')

  def __str__(self):
    return 'Nº do Pedido: {} || Linha: {}'.format(self.order.transaction_id, self.categoria)

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
  if created:
    Token.objects.create(user=instance)

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def send_create_user_email(sender, instance=None, created=False, **kwargs):
  if created:
    send_mail('Cadastro',
              'Obrigado por se cadastrar!\nEspero que curta sua experiência com nossos bolos!\n Não esqueça de seguir nossas redes sociais - '+
              '@amaboleria\nAtenciosamente, Equipe AMA Boleria', settings.EMAIL_HOST_USER, [instance.email], fail_silently=False)