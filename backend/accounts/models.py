# backend/accounts/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from fincas.models import Finca


class Rol(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    
    # 👈 AGREGAR ESTE CAMPO
    permisos = models.JSONField(default=list, blank=True, help_text="Lista de permisos asignados al rol")
    
    # 👈 AGREGAR ESTE CAMPO (opcional)
    activo = models.BooleanField(default=True)
    
    def __str__(self):
        return self.nombre


class Usuario(AbstractUser):
    finca = models.ForeignKey(
        Finca,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="usuarios"
    )
    rol = models.ForeignKey(
        Rol,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="usuarios"
    )
    telefono = models.CharField(max_length=30, blank=True, null=True)
    activo = models.BooleanField(default=True)
    
    def tiene_permiso(self, permiso):
        """Verifica si el usuario tiene un permiso específico"""
        if self.rol:
            return permiso in self.rol.permisos
        return False
    
    def __str__(self):
        return self.username