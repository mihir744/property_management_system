from django.contrib import admin
from .models import Property, PropertyMedia


class PropertyMediaInline(admin.TabularInline):
    model = PropertyMedia
    extra = 1


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "city_area",
        "property_type",
        "listing_type",   # ← new
        "price",
        "is_available",
        "created_at",
    )

    list_filter = (
        "listing_type",   # ← new — filter sidebar: For Rent / For Sale
        "city_area",
        "property_type",
        "is_available",
    )

    search_fields = (
        "title",
        "city_area",
        "description",
    )

    ordering = ("-created_at",)
    inlines = [PropertyMediaInline]


@admin.register(PropertyMedia)
class PropertyMediaAdmin(admin.ModelAdmin):
    list_display  = ("property", "media_type", "created_at")
    list_filter   = ("media_type",)
    search_fields = ("property__title",)