from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout
from django.http import HttpResponse
from django.shortcuts import render, redirect


# Create your views here.
def index(request):
    return HttpResponse('Users')

def user_login(request):
    return render(request,'user/login.html')

def user_auth(request):
    if request.method == 'POST':
        form = request.POST
        username = form['username']
        password = form['password']
        n = form['next']
        if len(n) > 0:
            next = form['next']
        else:
            next = 'home'
        user = authenticate(request, username=username, password=password)
        try:
            # check if user is valid
            if hasattr(user, 'is_active'):
                auth_login(request, user)
                # Redirect to a success page.
                return redirect(next)
            else:
                messages.error(request,
                               f"There is an error logging in, please check your credentials again or contact Administrator")
                return redirect('login')

        except Exception as e:
            messages.error(request, f"There was an error {e}")
            return redirect('login')

    else:
        return HttpResponse('We Missing')