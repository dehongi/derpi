from rest_framework import generics, permissions
from .models import Contact
from .serializers import ContactSerializer

class ContactListCreateView(generics.ListCreateAPIView):
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Get the user's company
        user_company = self.request.user.companies.first()
        if user_company:
            return Contact.objects.filter(company=user_company)
        return Contact.objects.none()

    def perform_create(self, serializer):
        # Automatically assign the contact to the user's company
        user_company = self.request.user.companies.first()
        if user_company:
            serializer.save(company=user_company)

class ContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Get the user's company
        user_company = self.request.user.companies.first()
        if user_company:
            return Contact.objects.filter(company=user_company)
        return Contact.objects.none()

