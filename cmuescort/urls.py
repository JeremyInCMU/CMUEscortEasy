"""cmuescort URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView
from cmuescort.apps.myapp.views import logInRequest, signUpRequest,logInSession,askForSession
from cmuescort.apps.myapp.views import addReservedSeat,updateSeats,addRiders,transVerAndEdges
from cmuescort.apps.myapp.views import staCal,sendEmail

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', TemplateView.as_view(template_name="logInPage.html")),
    url(r'^logIn_student/', TemplateView.as_view(template_name="escortAssist_student.html")),
    url(r'^loadClient/',logInRequest,name="logInRequestURL"),
    url(r'^addClient/', signUpRequest,name="signUpRequestURL"),
    url(r'^clientSession/', logInSession, name='logInSessionURL'),
    url(r'^askForSession/', askForSession, name='askForSessionURL'),
    url(r'^addReservedSeat/', addReservedSeat, name='addReservedSeatURL'),
    url(r'^updateSeats/', updateSeats, name='updateSeatsURL'),
    url(r'^logIn_manager/', TemplateView.as_view(template_name="escortAssist_manager.html")),
    url(r'^dailyStaCal/', staCal, name='dailyStaticCalculationURL'),
    url(r'^monthlyStaCal/', staCal, name='monthlyStaticCalculationURL'),
    url(r'^yearlyStaCal/', staCal, name='yearlyStaticCalculationURL'),
    url(r'^logIn_driver/', TemplateView.as_view(template_name="escortAssist_driver.html")),
    url(r'^addRiders/', addRiders, name="addRidersURL"),
    url(r'^transVerAndEdges/',transVerAndEdges, name="transVerAndEdgesURL"),
    url(r'^sendEmail/', sendEmail, name="sendEmailURL"),
]
