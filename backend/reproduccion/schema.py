# backend/reproduccion/schema.py
from datetime import date, timedelta
import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from .models import (
    InseminacionArtificial,
    MontaNatural,
    DiagnosticoPrenez,
    Reproduccion,
)


# ==========================================
# TYPES
# ==========================================

class InseminacionArtificialType(DjangoObjectType):
    class Meta:
        model = InseminacionArtificial
        fields = "__all__"


class MontaNaturalType(DjangoObjectType):
    class Meta:
        model = MontaNatural
        fields = "__all__"


class DiagnosticoPrenezType(DjangoObjectType):
    class Meta:
        model = DiagnosticoPrenez
        fields = "__all__"


class ReproduccionType(DjangoObjectType):
    class Meta:
        model = Reproduccion
        fields = "__all__"


# ==========================================
# QUERY
# ==========================================

class Query(graphene.ObjectType):
    inseminaciones = graphene.List(InseminacionArtificialType)
    montas_naturales = graphene.List(MontaNaturalType)
    diagnosticos_prenez = graphene.List(DiagnosticoPrenezType)
    reproducciones = graphene.List(ReproduccionType)
    vacas_prenadas = graphene.List(ReproduccionType)
    proximos_partos = graphene.List(ReproduccionType, dias=graphene.Int(default_value=30))

    def resolve_inseminaciones(self, info):
        return InseminacionArtificial.objects.all()

    def resolve_montas_naturales(self, info):
        return MontaNatural.objects.all()

    def resolve_diagnosticos_prenez(self, info):
        return DiagnosticoPrenez.objects.all()

    def resolve_reproducciones(self, info):
        return Reproduccion.objects.all()

    def resolve_vacas_prenadas(self, info):
        return Reproduccion.objects.filter(estado="PRENADA")

    def resolve_proximos_partos(self, info, dias=30):
        hoy = date.today()
        limite = hoy + timedelta(days=dias)
        return Reproduccion.objects.filter(
            fecha_parto_esperado__gte=hoy,
            fecha_parto_esperado__lte=limite,
            estado="PRENADA"
        )


# ==========================================
# MUTATIONS
# ==========================================

class CrearInseminacionArtificial(graphene.Mutation):
    class Arguments:
        finca_id = graphene.ID(required=True)
        hembra_id = graphene.ID(required=True)
        fecha = graphene.Date(required=True)
        reproductor_id = graphene.ID()
        numero_servicio = graphene.Int()
        numero_pajuela = graphene.String()
        lote_nitrogeno = graphene.String()
        tecnico_inseminador = graphene.String()
        observaciones = graphene.String()

    inseminacion = graphene.Field(InseminacionArtificialType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, finca_id, hembra_id, fecha, **kwargs):
        try:
            from fincas.models import Finca
            from animales.models import Animal
            from catalogos.models import Reproductor

            finca = Finca.objects.get(id=finca_id)
            hembra = Animal.objects.get(id=hembra_id)
            
            reproductor = None
            if kwargs.get('reproductor_id'):
                reproductor = Reproductor.objects.filter(id=kwargs['reproductor_id']).first()

            inseminacion = InseminacionArtificial.objects.create(
                finca=finca,
                hembra=hembra,
                reproductor=reproductor,
                fecha=fecha,
                numero_servicio=kwargs.get('numero_servicio', 1),
                numero_pajuela=kwargs.get('numero_pajuela', ''),
                lote_nitrogeno=kwargs.get('lote_nitrogeno', ''),
                tecnico_inseminador=kwargs.get('tecnico_inseminador', ''),
                observaciones=kwargs.get('observaciones', '')
            )
            
            return CrearInseminacionArtificial(
                inseminacion=inseminacion,
                success=True,
                message="Inseminación registrada exitosamente"
            )
        except Exception as e:
            return CrearInseminacionArtificial(
                inseminacion=None,
                success=False,
                message=str(e)
            )


class CrearDiagnosticoPrenez(graphene.Mutation):
    class Arguments:
        finca_id = graphene.ID(required=True)
        hembra_id = graphene.ID(required=True)
        fecha = graphene.Date(required=True)
        resultado_prenez = graphene.String(required=True)
        dias_gestacion = graphene.Int()
        metodo = graphene.String()
        veterinario_id = graphene.ID()
        observaciones = graphene.String()

    diagnostico = graphene.Field(DiagnosticoPrenezType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, finca_id, hembra_id, fecha, resultado_prenez, **kwargs):
        try:
            from fincas.models import Finca
            from animales.models import Animal
            from catalogos.models import Veterinario

            finca = Finca.objects.get(id=finca_id)
            hembra = Animal.objects.get(id=hembra_id)
            
            veterinario = None
            if kwargs.get('veterinario_id'):
                veterinario = Veterinario.objects.filter(id=kwargs['veterinario_id']).first()

            diagnostico = DiagnosticoPrenez.objects.create(
                finca=finca,
                hembra=hembra,
                fecha=fecha,
                resultado_prenez=resultado_prenez,
                dias_gestacion=kwargs.get('dias_gestacion', 0),
                metodo=kwargs.get('metodo', ''),
                veterinario=veterinario,
                observaciones=kwargs.get('observaciones', '')
            )
            
            return CrearDiagnosticoPrenez(
                diagnostico=diagnostico,
                success=True,
                message=f"Diagnóstico registrado: {resultado_prenez}"
            )
        except Exception as e:
            return CrearDiagnosticoPrenez(
                diagnostico=None,
                success=False,
                message=str(e)
            )


class CrearReproduccion(graphene.Mutation):
    class Arguments:
        finca_id = graphene.ID(required=True)
        madre_id = graphene.ID(required=True)
        fecha_parto_real = graphene.Date(required=True)
        tipo_parto = graphene.String()
        num_crias = graphene.Int()
        peso_total_crias = graphene.Decimal()
        observaciones = graphene.String()

    reproduccion = graphene.Field(ReproduccionType)
    success = graphene.Boolean()
    message = graphene.String()

    @login_required
    def mutate(self, info, finca_id, madre_id, fecha_parto_real, **kwargs):
        try:
            from fincas.models import Finca
            from animales.models import Animal

            finca = Finca.objects.get(id=finca_id)
            madre = Animal.objects.get(id=madre_id)

            reproduccion = Reproduccion.objects.create(
                finca=finca,
                madre=madre,
                fecha_parto_real=fecha_parto_real,
                tipo_parto=kwargs.get('tipo_parto', 'NORMAL'),
                num_crias=kwargs.get('num_crias', 1),
                peso_total_crias=kwargs.get('peso_total_crias', 0),
                observaciones=kwargs.get('observaciones', ''),
                estado="PARIDA"
            )
            
            return CrearReproduccion(
                reproduccion=reproduccion,
                success=True,
                message="Parto registrado exitosamente"
            )
        except Exception as e:
            return CrearReproduccion(
                reproduccion=None,
                success=False,
                message=str(e)
            )


# ==========================================
# MUTATION PRINCIPAL
# ==========================================

class Mutation(graphene.ObjectType):
    crear_inseminacion_artificial = CrearInseminacionArtificial.Field()
    crear_diagnostico_prenez = CrearDiagnosticoPrenez.Field()
    crear_reproduccion = CrearReproduccion.Field()