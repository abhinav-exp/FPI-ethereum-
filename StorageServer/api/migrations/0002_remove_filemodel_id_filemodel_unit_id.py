# Generated by Django 4.1.1 on 2022-10-07 08:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='filemodel',
            name='id',
        ),
        migrations.AddField(
            model_name='filemodel',
            name='unit_id',
            field=models.AutoField(default=0, primary_key=True, serialize=False),
            preserve_default=False,
        ),
    ]
