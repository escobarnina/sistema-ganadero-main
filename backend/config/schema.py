# backend/config/schema.py
import graphene
import graphql_jwt

# Importar queries y mutations de cada módulo
from accounts.schema import Query as AccountsQuery, Mutation as AccountsMutation
from catalogos.schema import Query as CatalogosQuery, Mutation as CatalogosMutation
from animales.schema import Query as AnimalesQuery, Mutation as AnimalesMutation
from sanidad.schema import Query as SanidadQuery, Mutation as SanidadMutation
from fincas.schema import Query as FincasQuery, Mutation as FincasMutation
from comercio.schema import Query as ComercioQuery, Mutation as ComercioMutation
from compras.schema import Query as ComprasQuery, Mutation as ComprasMutation
from produccion.schema import Query as ProduccionQuery, Mutation as ProduccionMutation
from alertas.schema import Query as AlertasQuery, Mutation as AlertasMutation
from reproduccion.schema import Query as ReproduccionQuery, Mutation as ReproduccionMutation
from rrhh.schema import Query as RrhhQuery, Mutation as RrhhMutation

# ==========================================
# QUERY PRINCIPAL
# ==========================================

class Query(
    AccountsQuery,
    CatalogosQuery,
    AnimalesQuery,
    SanidadQuery,
    FincasQuery,
    ComercioQuery,
    ComprasQuery,
    ProduccionQuery,
    AlertasQuery,
    ReproduccionQuery,
    RrhhQuery,
    graphene.ObjectType
):
    health = graphene.String()
    
    def resolve_health(self, info):
        return "API GraphQL del Sistema Ganadero funcionando correctamente"


# ==========================================
# MUTATION PRINCIPAL
# ==========================================

class Mutation(
    AccountsMutation,
    CatalogosMutation,
    AnimalesMutation,
    SanidadMutation,
    FincasMutation,
    ComercioMutation,
    ComprasMutation,
    ProduccionMutation,
    AlertasMutation,
    ReproduccionMutation,
    RrhhMutation,
    graphene.ObjectType
):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    delete_token_cookie = graphql_jwt.DeleteJSONWebTokenCookie.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)