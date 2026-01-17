from rest_framework import serializers

class OCRRequestSerializer(serializers.Serializer):
    file = serializers.FileField()

class KeyPointsRequestSerializer(serializers.Serializer):
    text = serializers.CharField()

class QuizRequestSerializer(serializers.Serializer):
    text = serializers.CharField()
    num_questions = serializers.IntegerField(min_value=1, max_value=15, default=7)
    concepts = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )