from django.db import models

class LoyaltyCustomer(models.Model):
    first_name = models.TextField()
    last_name = models.TextField()

    gender = models.CharField(max_length=1)
    nationality = models.TextField()

    email = models.TextField()
    mobile = models.CharField(unique=True, max_length=10)

    id_type = models.TextField()
    id_number = models.TextField()

    date_of_birth = models.DateField()
    card_no = models.CharField(unique=True, max_length=10)

    card_img = models.FileField(upload_to='static/customers/cards/')
    id_front = models.FileField(upload_to='static/customers/ids/')
    id_back = models.FileField(upload_to='static/customers/ids/')

    created_on = models.DateField(auto_now_add=True)
    created_by = models.IntegerField(default=0)
    valid = models.IntegerField(default=1)
    synced = models.IntegerField(default=0)


    def full_name(self):
        return f"{self.first_name} {self.last_name}"