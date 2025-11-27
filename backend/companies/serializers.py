from rest_framework import serializers
from .models import Company, CompanyMembership

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ('owner', 'created_at', 'updated_at')

class CompanyMembershipSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = CompanyMembership
        fields = '__all__'
        read_only_fields = ('joined_at',)

