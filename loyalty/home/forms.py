from django import forms

from .models import LoyaltyCustomer


class NewCustomer(forms.ModelForm):
    class Meta:
        model = LoyaltyCustomer
        exclude = ['created_on', 'valid','synced']
