"""
URL configuration for bakend project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from store.views import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('store/', include('store.urls')),
    path('api/health/', health_check),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )