from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .models import Loadout
from .serializers import LoadoutSerializer

@api_view(["PUT"])
def transactional_update_api(request, pk):
    try:
        loadout = Loadout.objects.get(pk=pk)

        force_error = request.data.get("force_error", False)

        with transaction.atomic():
            serializer = LoadoutSerializer(loadout, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)

            if force_error:
                raise Exception("Rollback test triggered.")

            serializer.save()

        return Response({"status": "success", "data": serializer.data}, status=200)

    except Exception as e:
        return Response(
            {"status": "failed", "error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
