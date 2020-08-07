from django.urls import path
from .views import (
  Registration_View,
  Send_Email,
  Get_User_Data,
  Get_User_Orders,
  Get_User_Orders_Items,
  BinQuery,
  ZeroAuth,
  Payment,
  Create_Order_Item,
  Update_User_Data
  )
from rest_framework.authtoken.views import obtain_auth_token
from django.contrib.auth import views as auth_views

urlpatterns = [
  path('api/register/', Registration_View.as_view(), name='registerapi'),
  path('api/login/', obtain_auth_token, name='loginapi'),
  path('api/sendmail/', Send_Email.as_view() , name='email'),
  path('api/update-user-data/', Update_User_Data.as_view() , name='update-user-data'),
  path('api/get-user-data/', Get_User_Data.as_view() , name='get-user-data'),
  path('api/get-user-orders/', Get_User_Orders.as_view() , name='get-user-orders'),
  path('api/get-user-order-items/', Get_User_Orders_Items.as_view() , name='get-user-order-items'),
  # path('api/start-checkout-session/', Create_Checkout_Session.as_view() , name='start-checkout-session'),
  # path('api/emailderedefinicaodesenha/', Send_Email.as_view() , name='emailderedefinicaodesenha'),
  # path('api/redefinicaodesenha/<uidb64>/<token>', Send_Email.as_view() , name='redefinicaodesenha'),

  path('reset_password/', auth_views.PasswordResetView.as_view(template_name='password_reset.html'), name='reset_password'),
  path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(template_name='password_reset_sent.html'), name='password_reset_done'),
  path('reset/<uidb64>/<token>', auth_views.PasswordResetConfirmView.as_view(template_name='password_reset_confirm.html'), name='password_reset_confirm'),
  path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name='password_reset_complete.html'), name='password_reset_complete'),

  path('api/create-order/', Create_Order_Item.as_view(), name='create-order'),
  path('api/card-bin-query/', BinQuery.as_view(), name='card-bin-query'),
  path('api/zero-auth/', ZeroAuth.as_view(), name='zero-auth'),
  path('api/payment/', Payment.as_view(), name='payment'),
  # path('api/resetPassword/', ResetPassword.as_view() , name='email'),
]

