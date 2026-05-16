# backend/animales/schema.py
import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required
from datetime import date

from .models import Raza, CategoriaAnimal, Animal, Parcela, AnimalParcela


# ==========================================
# TYPES EXISTENTES
# ==========================================

class RazaType(DjangoObjectType):
    class Meta:
        model = Raza
        fields = "__all__"


class CategoriaAnimalType(DjangoObjectType):
    class Meta:
        model = CategoriaAnimal
        fields = "__all__"


class AnimalType(DjangoObjectType):
    class Meta:
        model = Animal
        fields = "__all__"


# ==========================================
# NUEVOS TYPES - PARCELAS
# ==========================================

class ParcelaType(DjangoObjectType):
    animalesActuales = graphene.List('animales.schema.AnimalParcelaType')

    class Meta:
        model = Parcela
        fields = "__all__"

    def resolve_animalesActuales(self, info):
        return self.historial_animales.filter(fecha_salida__isnull=True)


class AnimalParcelaType(DjangoObjectType):
    class Meta:
        model = AnimalParcela
        fields = "__all__"


# ==========================================
# QUERY ACTUALIZADO
# ==========================================

class Query(graphene.ObjectType):
    # Queries existentes
    razas = graphene.List(RazaType)
    categorias_animales = graphene.List(CategoriaAnimalType)
    all_animales = graphene.List(AnimalType)
    animal_by_id = graphene.Field(AnimalType, id=graphene.ID(required=True))
    animal_by_arete = graphene.Field(AnimalType, nro_arete=graphene.String(required=True))
    animales_activos = graphene.List(AnimalType, finca_id=graphene.ID(required=True))

    # Nuevas queries para parcelas
    parcelas = graphene.List(ParcelaType, finca_id=graphene.ID(required=True))
    parcela = graphene.Field(ParcelaType, id=graphene.ID(required=True))
    animales_en_parcela = graphene.List(AnimalParcelaType, parcela_id=graphene.ID(required=True))
    animales_actuales_parcela = graphene.List(AnimalParcelaType, parcela_id=graphene.ID(required=True))

    def resolve_razas(self, info):
        return Raza.objects.all()

    def resolve_categorias_animales(self, info):
        return CategoriaAnimal.objects.all()

    def resolve_all_animales(self, info):
        return Animal.objects.all()

    def resolve_animal_by_id(self, info, id):
        return Animal.objects.get(id=id)

    def resolve_animal_by_arete(self, info, nro_arete):
        return Animal.objects.get(nro_arete=nro_arete)

    def resolve_animales_activos(self, info, finca_id):
        return Animal.objects.filter(finca_id=finca_id, estado='ACTIVO')

    # Resolvers para parcelas
    def resolve_parcelas(self, info, finca_id):
        return Parcela.objects.filter(finca_id=finca_id)

    def resolve_parcela(self, info, id):
        return Parcela.objects.get(id=id)

    def resolve_animales_en_parcela(self, info, parcela_id):
        return AnimalParcela.objects.filter(parcela_id=parcela_id)

    def resolve_animales_actuales_parcela(self, info, parcela_id):
        return AnimalParcela.objects.filter(parcela_id=parcela_id, fecha_salida__isnull=True)


# ==========================================
# MUTATIONS EXISTENTES (RAZAS, CATEGORIAS, ANIMALES)
# ==========================================

class CrearRaza(graphene.Mutation):
    class Arguments:
        nombre = graphene.String(required=True)
        orientacion = graphene.String()
        origen = graphene.String()
        descripcion = graphene.String()

    raza = graphene.Field(RazaType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, nombre, **kwargs):
        try:
            raza = Raza.objects.create(
                nombre=nombre,
                orientacion=kwargs.get('orientacion', 'DOBLE_PROPOSITO'),
                origen=kwargs.get('origen', ''),
                descripcion=kwargs.get('descripcion', '')
            )
            return CrearRaza(raza=raza, success=True, message="Raza creada")
        except Exception as e:
            return CrearRaza(raza=None, success=False, message=str(e))


class ActualizarRaza(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        nombre = graphene.String()
        orientacion = graphene.String()
        origen = graphene.String()
        activo = graphene.Boolean()

    raza = graphene.Field(RazaType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, id, **kwargs):
        try:
            raza = Raza.objects.get(id=id)
            if kwargs.get('nombre'):
                raza.nombre = kwargs['nombre']
            if kwargs.get('orientacion'):
                raza.orientacion = kwargs['orientacion']
            if kwargs.get('origen'):
                raza.origen = kwargs['origen']
            if kwargs.get('activo') is not None:
                raza.activo = kwargs['activo']
            raza.save()
            return ActualizarRaza(raza=raza, success=True, message="Raza actualizada")
        except Exception as e:
            return ActualizarRaza(raza=None, success=False, message=str(e))


class EliminarRaza(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, id):
        try:
            raza = Raza.objects.get(id=id)
            raza.delete()
            return EliminarRaza(success=True, message="Raza eliminada")
        except Exception as e:
            return EliminarRaza(success=False, message=str(e))


class CrearCategoriaAnimal(graphene.Mutation):
    class Arguments:
        nombre = graphene.String(required=True)
        descripcion = graphene.String()

    categoria = graphene.Field(CategoriaAnimalType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, nombre, **kwargs):
        try:
            categoria = CategoriaAnimal.objects.create(
                nombre=nombre,
                descripcion=kwargs.get('descripcion', '')
            )
            return CrearCategoriaAnimal(categoria=categoria, success=True, message="Categoría creada")
        except Exception as e:
            return CrearCategoriaAnimal(categoria=None, success=False, message=str(e))


class ActualizarCategoriaAnimal(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        nombre = graphene.String()
        activo = graphene.Boolean()

    categoria = graphene.Field(CategoriaAnimalType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, id, **kwargs):
        try:
            categoria = CategoriaAnimal.objects.get(id=id)
            if kwargs.get('nombre'):
                categoria.nombre = kwargs['nombre']
            if kwargs.get('activo') is not None:
                categoria.activo = kwargs['activo']
            categoria.save()
            return ActualizarCategoriaAnimal(categoria=categoria, success=True, message="Categoría actualizada")
        except Exception as e:
            return ActualizarCategoriaAnimal(categoria=None, success=False, message=str(e))


class EliminarCategoriaAnimal(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, id):
        try:
            categoria = CategoriaAnimal.objects.get(id=id)
            categoria.delete()
            return EliminarCategoriaAnimal(success=True, message="Categoría eliminada")
        except Exception as e:
            return EliminarCategoriaAnimal(success=False, message=str(e))


class CrearAnimal(graphene.Mutation):
    class Arguments:
        finca_id = graphene.ID(required=True)
        raza_id = graphene.ID()
        categoria_id = graphene.ID()
        padre_id = graphene.ID()
        madre_id = graphene.ID()
        nombre = graphene.String()
        nro_arete = graphene.String(required=True)
        sexo = graphene.String(required=True)
        fecha_nacimiento = graphene.Date()
        peso = graphene.Decimal()
        tipo_produccion = graphene.String()
        origen = graphene.String()
        color = graphene.String()
        observaciones = graphene.String()

    animal = graphene.Field(AnimalType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, finca_id, nro_arete, sexo, **kwargs):
        try:
            from fincas.models import Finca

            finca = Finca.objects.get(id=finca_id)

            animal = Animal.objects.create(
                finca=finca,
                nro_arete=nro_arete,
                sexo=sexo,
                raza_id=kwargs.get('raza_id'),
                categoria_id=kwargs.get('categoria_id'),
                padre_id=kwargs.get('padre_id'),
                madre_id=kwargs.get('madre_id'),
                nombre=kwargs.get('nombre'),
                fecha_nacimiento=kwargs.get('fecha_nacimiento'),
                peso=kwargs.get('peso', 0),
                tipo_produccion=kwargs.get('tipo_produccion', 'DOBLE_PROPOSITO'),
                origen=kwargs.get('origen', 'NACIDO_FINCA'),
                color=kwargs.get('color'),
                observaciones=kwargs.get('observaciones')
            )
            return CrearAnimal(animal=animal, success=True, message="Animal creado")
        except Exception as e:
            return CrearAnimal(animal=None, success=False, message=str(e))


class ActualizarAnimal(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        raza_id = graphene.ID()
        categoria_id = graphene.ID()
        nombre = graphene.String()
        sexo = graphene.String()
        fecha_nacimiento = graphene.Date()
        peso = graphene.Decimal()
        estado = graphene.String()
        tipo_produccion = graphene.String()
        observaciones = graphene.String()

    animal = graphene.Field(AnimalType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, id, **kwargs):
        try:
            animal = Animal.objects.get(id=id)
            if kwargs.get('raza_id'):
                animal.raza_id = kwargs['raza_id']
            if kwargs.get('categoria_id'):
                animal.categoria_id = kwargs['categoria_id']
            if kwargs.get('nombre') is not None:
                animal.nombre = kwargs['nombre']
            if kwargs.get('sexo'):
                animal.sexo = kwargs['sexo']
            if kwargs.get('fecha_nacimiento'):
                animal.fecha_nacimiento = kwargs['fecha_nacimiento']
            if kwargs.get('peso'):
                animal.peso = kwargs['peso']
            if kwargs.get('estado'):
                animal.estado = kwargs['estado']
            if kwargs.get('tipo_produccion'):
                animal.tipo_produccion = kwargs['tipo_produccion']
            if kwargs.get('observaciones') is not None:
                animal.observaciones = kwargs['observaciones']
            animal.save()
            return ActualizarAnimal(animal=animal, success=True, message="Animal actualizado")
        except Exception as e:
            return ActualizarAnimal(animal=None, success=False, message=str(e))


class EliminarAnimal(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, id):
        try:
            animal = Animal.objects.get(id=id)
            animal.delete()
            return EliminarAnimal(success=True, message="Animal eliminado")
        except Exception as e:
            return EliminarAnimal(success=False, message=str(e))


# ==========================================
# NUEVAS MUTATIONS - PARCELAS
# ==========================================

class CrearParcela(graphene.Mutation):
    class Arguments:
        finca_id = graphene.ID(required=True)
        nombre = graphene.String(required=True)
        tamano = graphene.Decimal()
        capacidad_maxima = graphene.Int()
        tipo_pastura = graphene.String()
        estado = graphene.String()

    parcela = graphene.Field(ParcelaType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, finca_id, nombre, **kwargs):
        try:
            from fincas.models import Finca

            finca = Finca.objects.get(id=finca_id)

            parcela = Parcela.objects.create(
                finca=finca,
                nombre=nombre,
                tamano=kwargs.get('tamano', 0),
                capacidad_maxima=kwargs.get('capacidad_maxima', 0),
                tipo_pastura=kwargs.get('tipo_pastura', ''),
                estado=kwargs.get('estado', 'ACTIVA')
            )
            return CrearParcela(parcela=parcela, success=True, message="Parcela creada exitosamente")
        except Exception as e:
            return CrearParcela(parcela=None, success=False, message=str(e))


class ActualizarParcela(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        nombre = graphene.String()
        tamano = graphene.Decimal()
        capacidad_maxima = graphene.Int()
        tipo_pastura = graphene.String()
        estado = graphene.String()

    parcela = graphene.Field(ParcelaType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, id, **kwargs):
        try:
            parcela = Parcela.objects.get(id=id)
            if kwargs.get('nombre'):
                parcela.nombre = kwargs['nombre']
            if kwargs.get('tamano'):
                parcela.tamano = kwargs['tamano']
            if kwargs.get('capacidad_maxima'):
                parcela.capacidad_maxima = kwargs['capacidad_maxima']
            if kwargs.get('tipo_pastura'):
                parcela.tipo_pastura = kwargs['tipo_pastura']
            if kwargs.get('estado'):
                parcela.estado = kwargs['estado']
            parcela.save()
            return ActualizarParcela(parcela=parcela, success=True, message="Parcela actualizada")
        except Exception as e:
            return ActualizarParcela(parcela=None, success=False, message=str(e))


class EliminarParcela(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, id):
        try:
            parcela = Parcela.objects.get(id=id)
            parcela.delete()
            return EliminarParcela(success=True, message="Parcela eliminada")
        except Exception as e:
            return EliminarParcela(success=False, message=str(e))


# ==========================================
# MUTATIONS - MOVIMIENTOS
# ==========================================

class MoverAnimalAParcela(graphene.Mutation):
    class Arguments:
        finca_id = graphene.ID(required=True)
        animal_id = graphene.ID(required=True)
        parcela_id = graphene.ID(required=True)
        fecha_ingreso = graphene.Date(required=True)
        observaciones = graphene.String()

    movimiento = graphene.Field(AnimalParcelaType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, finca_id, animal_id, parcela_id, fecha_ingreso, **kwargs):
        try:
            from fincas.models import Finca

            finca = Finca.objects.get(id=finca_id)
            animal = Animal.objects.get(id=animal_id)
            parcela = Parcela.objects.get(id=parcela_id)

            # Cerrar movimiento anterior
            AnimalParcela.objects.filter(
                animal=animal, fecha_salida__isnull=True
            ).update(fecha_salida=fecha_ingreso)

            # Crear nuevo movimiento
            movimiento = AnimalParcela.objects.create(
                animal=animal,
                parcela=parcela,
                fecha_ingreso=fecha_ingreso,
                observaciones=kwargs.get('observaciones', '')
            )
            return MoverAnimalAParcela(movimiento=movimiento, success=True, message="Animal movido exitosamente")
        except Exception as e:
            return MoverAnimalAParcela(movimiento=None, success=False, message=str(e))


class SacarAnimalDeParcela(graphene.Mutation):
    class Arguments:
        movimiento_id = graphene.ID(required=True)
        fecha_salida = graphene.Date(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, movimiento_id, fecha_salida):
        try:
            movimiento = AnimalParcela.objects.get(id=movimiento_id)
            movimiento.fecha_salida = fecha_salida
            movimiento.save()
            return SacarAnimalDeParcela(success=True, message="Animal retirado de la parcela")
        except Exception as e:
            return SacarAnimalDeParcela(success=False, message=str(e))


# ==========================================
# MUTATION PRINCIPAL
# ==========================================

class Mutation(graphene.ObjectType):
    # Razas
    crear_raza = CrearRaza.Field()
    actualizar_raza = ActualizarRaza.Field()
    eliminar_raza = EliminarRaza.Field()

    # Categorías
    crear_categoria_animal = CrearCategoriaAnimal.Field()
    actualizar_categoria_animal = ActualizarCategoriaAnimal.Field()
    eliminar_categoria_animal = EliminarCategoriaAnimal.Field()

    # Animales
    crear_animal = CrearAnimal.Field()
    actualizar_animal = ActualizarAnimal.Field()
    eliminar_animal = EliminarAnimal.Field()

    # Parcelas
    crear_parcela = CrearParcela.Field()
    actualizar_parcela = ActualizarParcela.Field()
    eliminar_parcela = EliminarParcela.Field()

    # Movimientos
    mover_animal_a_parcela = MoverAnimalAParcela.Field()
    sacar_animal_de_parcela = SacarAnimalDeParcela.Field()
