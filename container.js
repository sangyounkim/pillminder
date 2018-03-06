class Container {
    constructor({
        id,
        pill_type,
        reminder_time,
        frequency,
        last_opened,
        brand_name: brandName,
        manufacturer_name: manufacturerName,
        substance_name: substanceName,
        purpose,
        indications_and_usage: indicationsAndUsage,
        brand_primary_color: brandPrimaryColor,
        brand_secondary_color: brandSecondaryColor,
    }) {
        this.id = id;
        this.pillType = pill_type;
        this.reminderTime = reminder_time;
        this.frequency = frequency;
        this.lastOpened = last_opened;
        this.drugInfo = {
            brandName,
            manufacturerName,
            purpose,
            substanceName,
            indicationsAndUsage,
            brandPrimaryColor,
            brandSecondaryColor,
        };
    }
}

module.exports = Container;
