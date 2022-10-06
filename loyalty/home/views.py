import requests
import random

from django.contrib import messages
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from .forms import NewCustomer
from .models import LoyaltyCustomer


# Create your views here.
@login_required()
def index(request):
    return render(request, 'home/index.html')


@login_required()
def new_cust(request):
    return render(request, 'home/new_cust.html')


@login_required()
def otp_verif(request):
    if request.method == 'GET':
        form = request.GET
        otp = random.randrange(111111, 999999, 6)
        number = form['number']
        m = form['message']
        message = f"{m} OTP : {otp}"

        endpoint = f"https://apps.mnotify.net/smsapi?key=VE36nLRD9rCWroMvHE6i2C097&to={number}&msg={message}&sender_id=SNEDA SHOP"
        response = requests.get(endpoint)
        data = response.json()
        pass_data = {
            'response': data,
            'otp': otp
        }
        return JsonResponse(pass_data, safe=False)


def register_customer(request):
    if request.method == 'POST':
        form = NewCustomer(request.POST, request.FILES)
        if form.is_valid():
            try:
                form.save()
                messages.success(request, "done%%Card added successfully")
                return redirect('home')
            except Exception as e:
                messages.success(request, f"Could Not SAVE FORM {e}")
                return redirect('register')

        else:
            return HttpResponse(f'error%%Form Is Invalid {form}')

def api(request,tool,link):
    if tool == 'verifnum':
        return HttpResponse(LoyaltyCustomer.objects.filter(mobile=link).count())
    elif tool == 'verifcard':
        return HttpResponse(LoyaltyCustomer.objects.filter(card_no=link).count())
