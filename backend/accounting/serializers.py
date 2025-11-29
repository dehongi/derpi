from rest_framework import serializers
from .models import ChartOfAccounts, JournalEntry, Transaction

class ChartOfAccountsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChartOfAccounts
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'company')


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'account', 'debit', 'credit', 'description']
        read_only_fields = ('created_at', 'updated_at')


class JournalEntrySerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True)

    class Meta:
        model = JournalEntry
        fields = ['id', 'entry_number', 'date', 'description', 'reference', 'status', 'transactions', 'created_at', 'updated_at']
        read_only_fields = ('created_at', 'updated_at', 'company', 'created_by')

    def validate(self, data):
        transactions_data = data.get('transactions', [])
        total_debit = sum(item.get('debit', 0) for item in transactions_data)
        total_credit = sum(item.get('credit', 0) for item in transactions_data)

        if total_debit != total_credit:
            raise serializers.ValidationError(f"Journal entry must be balanced. Total Debit: {total_debit}, Total Credit: {total_credit}")
        
        return data

    def create(self, validated_data):
        transactions_data = validated_data.pop('transactions')
        journal_entry = JournalEntry.objects.create(**validated_data)
        for transaction_data in transactions_data:
            Transaction.objects.create(journal_entry=journal_entry, **transaction_data)
        return journal_entry

    def update(self, instance, validated_data):
        transactions_data = validated_data.pop('transactions', None)
        
        # Update JournalEntry fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if transactions_data is not None:
            # For simplicity, we'll remove existing transactions and re-create them
            # In a more complex scenario, we might want to update existing ones
            instance.transactions.all().delete()
            for transaction_data in transactions_data:
                Transaction.objects.create(journal_entry=instance, **transaction_data)
        
        return instance


