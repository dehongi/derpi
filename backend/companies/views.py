from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Company, CompanyMembership
from .serializers import CompanySerializer, CompanyMembershipSerializer

class CompanyListCreateView(generics.ListCreateAPIView):
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return all companies where user is owner or member
        user = self.request.user
        owned_companies = Company.objects.filter(owner=user)
        member_companies = Company.objects.filter(memberships__user=user, memberships__is_active=True)
        return (owned_companies | member_companies).distinct()

    def perform_create(self, serializer):
        # Create company and automatically create membership with owner role
        company = serializer.save(owner=self.request.user)
        
        # Create membership with owner role
        CompanyMembership.objects.create(
            user=self.request.user,
            company=company,
            role='owner',
            is_active=True
        )
        
        # Set as active company if user doesn't have one
        if not self.request.user.active_company:
            self.request.user.active_company = company
            self.request.user.save()

class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return companies where user is owner or member
        user = self.request.user
        owned_companies = Company.objects.filter(owner=user)
        member_companies = Company.objects.filter(memberships__user=user, memberships__is_active=True)
        return (owned_companies | member_companies).distinct()

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def set_active_company(request, pk):
    """Set a company as the active company for the current user"""
    try:
        # Check if user has access to this company
        company = Company.objects.get(pk=pk)
        
        # Verify user is owner or member
        is_owner = company.owner == request.user
        is_member = CompanyMembership.objects.filter(
            user=request.user,
            company=company,
            is_active=True
        ).exists()
        
        if not (is_owner or is_member):
            return Response(
                {'error': 'شما به این شرکت دسترسی ندارید'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Set as active company
        request.user.active_company = company
        request.user.save()
        
        return Response({
            'message': 'شرکت فعال با موفقیت تغییر کرد',
            'active_company': CompanySerializer(company).data
        })
    except Company.DoesNotExist:
        return Response(
            {'error': 'شرکت یافت نشد'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_active_company(request):
    """Get the current active company for the user"""
    if request.user.active_company:
        return Response(CompanySerializer(request.user.active_company).data)
    return Response({'message': 'هیچ شرکت فعالی تنظیم نشده است'}, status=status.HTTP_404_NOT_FOUND)


class CompanyUsersView(generics.ListAPIView):
    """List all users who are members of the current active company"""
    from accounts.serializers import UserUpdateSerializer
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        if not self.request.user.active_company:
            return User.objects.none()
        
        # Get all users who are members of the active company
        # We filter by CompanyMembership for the active company
        return User.objects.filter(
            company_memberships__company=self.request.user.active_company,
            company_memberships__is_active=True
        ).distinct()

