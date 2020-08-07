from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('accounts.urls')),
    path('', TemplateView.as_view(template_name="index.html")),
    path('carrinho-de-compras/', TemplateView.as_view(template_name="index.html")),
    path('minha-conta/', TemplateView.as_view(template_name="index.html")),
    path('login/', TemplateView.as_view(template_name="index.html")),
    path('cadastro/', TemplateView.as_view(template_name="index.html")),
    path('bolos/', TemplateView.as_view(template_name="index.html")),
    path('linhas/', TemplateView.as_view(template_name="index.html")),
    path('montagem/', TemplateView.as_view(template_name="index.html")),
    path('quem-somos-nos', TemplateView.as_view(template_name="index.html")),
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)