# populate_db.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neurodetect.settings')
django.setup()

from core.models import User

# Create a test user
user, created = User.objects.get_or_create(
    username='testuser',
    defaults={
        'first_name': 'Test',
        'last_name': 'User',
        'email': 'test@example.com',
        'age': 25,
        'height': 170.5,
        'weight': 65.2,
        'blood_group': 'O+',
        'is_active': True,
    }
)

if created:
    user.set_password('testpassword123')
    user.save()
    print("Test user created successfully.")
else:
    print("Test user already exists.")
