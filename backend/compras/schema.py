import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from .models import (
    Proveedor,
    NotaCompra,
    DetalleCompra,
    DetalleCompraAlimento,
)


class ProveedorType(DjangoObjectType):
    id = graphene.ID()
    
    class Meta:
        model = Proveedor
        fields = "__all__"
    
    def resolve_id(self, info):
        return self.id


class NotaCompraType(DjangoObjectType):
    class Meta:
        model = NotaCompra
        fields = "__all__"


class DetalleCompraType(DjangoObjectType):
    class Meta:
        model = DetalleCompra
        fields = "__all__"


class DetalleCompraAlimentoType(DjangoObjectType):
    class Meta:
        model = DetalleCompraAlimento
        fields = "__all__"


# ==========================================
# QUERY
# ==========================================

class Query(graphene.ObjectType):
    proveedores = graphene.List(ProveedorType)
    notas_compra = graphene.List(NotaCompraType)
    detalles_compra = graphene.List(DetalleCompraType)
    detalles_compra_alimento = graphene.List(DetalleCompraAlimentoType)

    compras_por_anio = graphene.List(
        NotaCompraType,
        anio=graphene.Int(required=True)
    )

    def resolve_proveedores(self, info):
        return Proveedor.objects.all()

    def resolve_notas_compra(self, info):
        return NotaCompra.objects.all()

    def resolve_detalles_compra(self, info):
        return DetalleCompra.objects.all()

    def resolve_detalles_compra_alimento(self, info):
        return DetalleCompraAlimento.objects.all()

    def resolve_compras_por_anio(self, info, anio):
        return NotaCompra.objects.filter(fecha_compra__year=anio)


# ==========================================
# MUTATIONS - CREAR PROVEEDOR
# ==========================================

class CrearProveedor(graphene.Mutation):
    class Arguments:
        finca_id = graphene.ID(required=True)
        nombre = graphene.String(required=True)
        apellidos = graphene.String()
        direccion = graphene.String()
        telefono = graphene.String()
        nit = graphene.String()
        ci = graphene.String()

    proveedor = graphene.Field(ProveedorType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(
        self,
        info,
        finca_id,
        nombre,
        apellidos=None,
        direccion=None,
        telefono=None,
        nit=None,
        ci=None
    ):
        try:
            from fincas.models import Finca

            finca = Finca.objects.get(id=finca_id)

            proveedor = Proveedor.objects.create(
                finca=finca,
                nombre=nombre,
                apellidos=apellidos,
                direccion=direccion,
                telefono=telefono,
                nit=nit,
                ci=ci
            )
            return CrearProveedor(proveedor=proveedor, success=True, message=f"Proveedor {nombre} creado exitosamente")
        except Exception as e:
            return CrearProveedor(proveedor=None, success=False, message=str(e))


# ==========================================
# MUTATIONS - ACTUALIZAR PROVEEDOR
# ==========================================

class ActualizarProveedor(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        nombre = graphene.String()
        apellidos = graphene.String()
        direccion = graphene.String()
        telefono = graphene.String()
        nit = graphene.String()
        ci = graphene.String()

    proveedor = graphene.Field(ProveedorType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, id, nombre=None, apellidos=None, direccion=None, telefono=None, nit=None, ci=None):
        try:
            proveedor = Proveedor.objects.get(pk=id)
            if nombre:
                proveedor.nombre = nombre
            if apellidos:
                proveedor.apellidos = apellidos
            if direccion:
                proveedor.direccion = direccion
            if telefono:
                proveedor.telefono = telefono
            if nit:
                proveedor.nit = nit
            if ci:
                proveedor.ci = ci
            proveedor.save()
            return ActualizarProveedor(proveedor=proveedor, success=True, message="Proveedor actualizado exitosamente")
        except Exception as e:
            return ActualizarProveedor(proveedor=None, success=False, message=str(e))


# ==========================================
# MUTATIONS - ELIMINAR PROVEEDOR
# ==========================================

class EliminarProveedor(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, id):
        try:
            proveedor = Proveedor.objects.get(pk=id)
            nombre = proveedor.nombre
            proveedor.delete()
            return EliminarProveedor(success=True, message=f"Proveedor {nombre} eliminado exitosamente")
        except Exception as e:
            return EliminarProveedor(success=False, message=str(e))


# ==========================================
# MUTATIONS - NOTA COMPRA
# ==========================================

class CrearNotaCompra(graphene.Mutation):
    class Arguments:
        finca_id = graphene.ID(required=True)
        proveedor_id = graphene.ID()
        tipo_compra = graphene.String()
        fecha_compra = graphene.Date(required=True)
        observaciones = graphene.String()

    nota_compra = graphene.Field(NotaCompraType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(
        self,
        info,
        finca_id,
        fecha_compra,
        proveedor_id=None,
        tipo_compra="MEDICAMENTO",
        observaciones=None
    ):
        try:
            from fincas.models import Finca

            finca = Finca.objects.get(id=finca_id)
            proveedor = Proveedor.objects.filter(id=proveedor_id).first() if proveedor_id else None

            nota_compra = NotaCompra.objects.create(
                finca=finca,
                proveedor=proveedor,
                tipo_compra=tipo_compra,
                fecha_compra=fecha_compra,
                observaciones=observaciones
            )
            return CrearNotaCompra(nota_compra=nota_compra, success=True, message="Nota de compra creada exitosamente")
        except Exception as e:
            return CrearNotaCompra(nota_compra=None, success=False, message=str(e))


# ==========================================
# MUTATIONS - DETALLE COMPRA (MEDICAMENTO)
# ==========================================

class CrearDetalleCompra(graphene.Mutation):
    class Arguments:
        nota_compra_id = graphene.ID(required=True)
        medicamento_id = graphene.ID(required=True)
        precio_unitario = graphene.Decimal(required=True)
        cantidad = graphene.Decimal(required=True)

    detalle_compra = graphene.Field(DetalleCompraType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(
        self,
        info,
        nota_compra_id,
        medicamento_id,
        precio_unitario,
        cantidad
    ):
        try:
            from catalogos.models import Medicamento

            nota_compra = NotaCompra.objects.get(id=nota_compra_id)
            medicamento = Medicamento.objects.get(id=medicamento_id)

            detalle = DetalleCompra.objects.create(
                nota_compra=nota_compra,
                medicamento=medicamento,
                precio_unitario=precio_unitario,
                cantidad=cantidad
            )
            return CrearDetalleCompra(detalle_compra=detalle, success=True, message="Detalle de compra creado exitosamente")
        except Exception as e:
            return CrearDetalleCompra(detalle_compra=None, success=False, message=str(e))


# ==========================================
# MUTATIONS - DETALLE COMPRA ALIMENTO
# ==========================================

class CrearDetalleCompraAlimento(graphene.Mutation):
    class Arguments:
        nota_compra_id = graphene.ID(required=True)
        alimento_id = graphene.ID(required=True)
        precio_unitario = graphene.Decimal(required=True)
        cantidad = graphene.Decimal(required=True)

    detalle_compra_alimento = graphene.Field(DetalleCompraAlimentoType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(
        self,
        info,
        nota_compra_id,
        alimento_id,
        precio_unitario,
        cantidad
    ):
        try:
            from catalogos.models import Alimento

            nota_compra = NotaCompra.objects.get(id=nota_compra_id)
            alimento = Alimento.objects.get(id=alimento_id)

            detalle = DetalleCompraAlimento.objects.create(
                nota_compra=nota_compra,
                alimento=alimento,
                precio_unitario=precio_unitario,
                cantidad=cantidad
            )
            return CrearDetalleCompraAlimento(detalle_compra_alimento=detalle, success=True, message="Detalle de compra de alimento creado exitosamente")
        except Exception as e:
            return CrearDetalleCompraAlimento(detalle_compra_alimento=None, success=False, message=str(e))


# ==========================================
# MUTATION PRINCIPAL
# ==========================================

class Mutation(graphene.ObjectType):
    # Proveedores
    crear_proveedor = CrearProveedor.Field()
    actualizar_proveedor = ActualizarProveedor.Field()
    eliminar_proveedor = EliminarProveedor.Field()
    
    # Notas de Compra
    crear_nota_compra = CrearNotaCompra.Field()
    
    # Detalle Compra (Medicamentos)
    crear_detalle_compra = CrearDetalleCompra.Field()
    
    # Detalle Compra Alimento
    crear_detalle_compra_alimento = CrearDetalleCompraAlimento.Field()