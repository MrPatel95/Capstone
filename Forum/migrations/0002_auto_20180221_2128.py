# Generated by Django 2.0.2 on 2018-02-21 21:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Forum', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='replypost',
            name='parent_id',
            field=models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, to='Forum.ReplyPost'),
        ),
    ]
