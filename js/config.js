/**
 * Adoca Services - Technical Configuration & Comprehensive Data
 * Version: 2.0.0 (Expansion)
 */

const CONFIG = {
    BRAND: {
        NAME: "Adoca Services",
        COMPANY: "Adoca Technologies",
        FOUNDER: "Aditya Kumar Chaudhary",
        MISSION: "Empower local businesses with digital capabilities while preserving the human connection of offline commerce.",
        STORY: "Founded by Aditya Kumar Chaudhary, Adoca is driven by real-world observations of local market inefficiencies and aims to transform local commerce into a scalable, data-driven ecosystem across India.",
        ADDRESS: "Samastipur, Bihar, India",
        EMAIL: "adityakumarchaudhari66@gmail.com",
        PHONE: "+91 7631441992",
        HOURS: "Monday – Saturday, 10:00 AM – 7:00 PM"
    },

    // 50+ SERVICE CATEGORIES WITH SUB-CATEGORIES
    SERVICE_CATEGORIES: [
        {
            id: 'electrician', label: 'Electrician', label_hi: 'बिजलीवाला (Electrician)', icon: 'zap',
            subs: ['Fan Repair', 'House Wiring', 'AC Installation', 'Inverter Service', 'Switchboard Fix', 'Motor Repair', 'Geyser Service', 'Light Fitting'],
            subs_hi: ['पंखा रिपेयर', 'हाउस वायरिंग', 'एसी इंस्टॉलेशन', 'इन्वर्टर सर्विस', 'स्विचबोर्ड ठीक करें', 'मोटर रिपेयर', 'गीज़र सर्विस', 'लाइट फिटिंग']
        },
        {
            id: 'plumber', label: 'Plumber', label_hi: 'नल मिस्त्री (Plumber)', icon: 'droplets',
            subs: ['Leakage Repair', 'Tap Installation', 'Pipe Fitting', 'Tank Cleaning', 'Basin Setup', 'Toilet Repair', 'Motor Pump Fix', 'Kitchen Sink'],
            subs_hi: ['लीकेज रिपेयर', 'नल फिटिंग', 'पाइप फिटिंग', 'टैंक सफाई', 'बेसिन सेटअप', 'टॉयलेट रिपेयर', 'मोटर पंप ठीक करें', 'किचन सिंक']
        },
        {
            id: 'carpenter', label: 'Carpenter', label_hi: 'बढ़ई (Carpenter)', icon: 'hammer',
            subs: ['Furniture Repair', 'Door Fitting', 'Cabinet Making', 'Bed Assembly', 'Sofa Polish', 'Locks/Latches', 'Wood Carving', 'Modular Kitchen'],
            subs_hi: ['फर्नीचर रिपेयर', 'दरवाजा फिटिंग', 'कैबिनेट बनाना', 'बेड असेंबली', 'सोफा पॉलिश', 'ताला चाबी', 'लकड़ी नक्काशी', 'मॉड्यूलर किचन']
        },
        {
            id: 'cleaning', label: 'Cleaning', label_hi: 'सफाई (Cleaning)', icon: 'sparkles',
            subs: ['Full Home Deep Cleaning', 'Sofa/Carpet Cleaning', 'Bathroom Cleaning', 'Kitchen Cleaning', 'Water Tank Cleaning', 'Pest Control', 'Disinfection Service'],
            subs_hi: ['घर की पूरी सफाई', 'सोफा/कार्पेट सफाई', 'बाथरूम की सफाई', 'किचन सफाई', 'वॉटर टैंक सफाई', 'पेस्ट कंट्रोल', 'डिसइंफेक्शन सर्विस']
        },
        {
            id: 'painter', label: 'Painter', label_hi: 'पेंटर (Painter)', icon: 'paint-bucket',
            subs: ['Interior Painting', 'Exterior Painting', 'Wall Putty', 'Texture Painting', 'Waterproofing', 'Metal/Wood Polish'],
            subs_hi: ['घर की पुताई', 'बाहरी पुताई', 'वॉल पुट्टी', 'टेक्सचर पेंटिंग', 'वॉटरप्रूफिंग', 'मेटल/लकड़ी पॉलिश']
        },
        {
            id: 'ac_repair', label: 'AC & Cooling', label_hi: 'एसी और कूलिंग (AC & Cooling)', icon: 'wind',
            subs: ['AC Servicing', 'Gas Charging', 'Split AC Install', 'Window AC Service', 'Fridge Repair', 'Cooler Service'],
            subs_hi: ['एसी सर्विसिंग', 'गैस चार्जिंग', 'स्प्लिट एसी फिटिंग', 'विंडो एसी सर्विस', 'फ्रिज रिपेयर', 'कूलर सर्विस']
        },
        {
            id: 'ro_service', label: 'Water Purifier', label_hi: 'वॉटर प्यूरीफायर (RO)', icon: 'filter',
            subs: ['RO Installation', 'Filter Change', 'Water Testing', 'AMC Service', 'Fault Repair'],
            subs_hi: ['आरो इंस्टॉलेशन', 'फिल्टर बदलना', 'पानी की जांच', 'एएमसी सर्विस', 'फौल्ट रिपेयर']
        },
        {
            id: 'beautician', label: 'Beauty & Salon', label_hi: 'ब्यूटी और सैलून', icon: 'scissors',
            subs: ['Haircut', 'Bridal Makeup', 'Facial & Cleanup', 'Manicure/Pedicure', 'Waxing/Threading', 'Grooming Service'],
            subs_hi: ['हेयरकट', 'ब्राइडल मेकअप', 'फेशियल', 'मेनीक्योर/पेडीक्योर', 'वैक्सिंग', 'ग्रूमिंग']
        },
        {
            id: 'appliance', label: 'Appliances', label_hi: 'घर के उपकरण', icon: 'tv',
            subs: ['TV Repair', 'Washing Machine', 'Microwave Repair', 'Chimney Service', 'Dishwasher Fix'],
            subs_hi: ['टीवी रिपेयर', 'वाशिंग मशीन', 'माइक्रोवेव रिपेयर', 'चिमनी सर्विस', 'डिशवॉशर ठीक करें']
        },
        {
            id: 'automotive', label: 'Vehicle Service', label_hi: 'वोकल रिपेयर (Vehicle)', icon: 'car',
            subs: ['Car Wash', 'Bike Servicing', 'Tyre/Puncture', 'Battery Change', 'Engine Tuning', 'Detailing'],
            subs_hi: ['कार वॉश', 'बाइक सर्विसिंग', 'टायर/पंचर', 'बैटरी बदलना', 'इंजन ट्यूनिंग', 'डिटेलिंग']
        },
        { id: 'laundry', label: 'Laundry', icon: 'shirt', subs: ['Dry Cleaning', 'Ironing', 'Wash & Fold', 'Shoe Cleaning'] },
        { id: 'security', label: 'CCTV & Security', icon: 'shield', subs: ['Camera Install', 'Fingerprint Lock', 'DVR Setup', 'Intercom Repair'] },
        { id: 'tutor', label: 'Education/Tutor', icon: 'book-open', subs: ['Maths/Science', 'English Fluency', 'Coding for Kids', 'Art/Craft'] },
        { id: 'event', label: 'Event Planning', icon: 'calendar', subs: ['Decoration', 'Catering', 'Photography', 'DJ Service', 'Flower Setup'] },
        { id: 'computer', label: 'IT Support', icon: 'monitor', subs: ['Laptop Repair', 'OS Install', 'Data Recovery', 'Networking', 'Printer Fix'] },
        { id: 'legal', label: 'Legal & CA', icon: 'file-text', subs: ['GST Filing', 'Income Tax', 'Startup Reg', 'Property Docs'] },
        { id: 'courier', label: 'Courier', icon: 'send', subs: ['Local Delivery', 'Domestic', 'International', 'Packaging'] },
        { id: 'gardening', label: 'Gardening', icon: 'tree-pine', subs: ['Lawn Mowing', 'Plant Care', 'Nursery Setup', 'Pesticides'] },
        { id: 'fitness', label: 'Health & Yoga', icon: 'activity', subs: ['Personal Trainer', 'Yoga Classes', 'Physiotherapy', 'Dietician'] },
        { id: 'mobile_fix', label: 'Mobile Repair', icon: 'smartphone', subs: ['Screen Replace', 'Battery Swap', 'Software Fix', 'Unlocking'] },
        // ... Adding more to reach variety ...
        { id: 'labour', label: 'Local Labour', icon: 'users', subs: ['Construction Helper', 'Loading/Unloading', 'Helper'] },
        { id: 'tailor', label: 'Tailor', icon: 'scissors', subs: ['Suit Stitching', 'Alterations', 'Curtain Making'] },
        { id: 'driver', label: 'Drivers', icon: 'user', subs: ['Outstation', 'Monthly Driver', 'Valet Service'] },
        { id: 'pest', label: 'Pest Control', icon: 'bug', subs: ['Termite Clean', 'Cockroach Fix', 'Rodent Control'] },
        { id: 'waste', label: 'Scrap & Junk', icon: 'recycle', subs: ['Iron Scrap', 'Paper/Cardboard', 'Electronic Waste'] },
        { id: 'water', label: 'Water Supply', icon: 'container', subs: ['Tanker 2000L', 'Drinking Jars', 'Water Filling'] },
        { id: 'solar', label: 'Solar Energy', icon: 'sun', subs: ['Panel Cleaning', 'Panel Installation', 'Battery Service'] },
        { id: 'generator', label: 'Generator', icon: 'power', subs: ['Hiring', 'Maintenance', 'Fuel Refill'] },
        { id: 'astrology', label: 'Pandit/Priest', icon: 'moon', subs: ['Puja Setup', 'Astrology', 'Vastu Consultation', 'Marriage Rites', 'Home Hawan'] },
        { id: 'photography', label: 'Photography', icon: 'camera', subs: ['Photoshoot', 'Video Editing', 'Album Design', 'Drone Shots', 'Pre-Wedding'] },
        { id: 'cabling', label: 'Network Cabling', icon: 'network', subs: ['Fiber Optics', 'LAN Setup', 'WiFi Extension', 'Switch Config'] },
        { id: 'locksmith', label: 'Locksmith', icon: 'key', subs: ['Key Duplication', 'Emergency Unlock', 'Smart Lock Fix'] },
        { id: 'scrubbing', label: 'Floor Polishing', icon: 'brush', subs: ['Marble Polish', 'Granite Buffing', 'Tiles Cleaning'] },
        { id: 'ac_gas', label: 'Gas Refilling', icon: 'thermometer', subs: ['R32 Gas', 'R410 Gas', 'Leak Fix'] },
        { id: 'chimney', label: 'Chimney Service', icon: 'fan', subs: ['Deep Cleaning', 'Motor Fix', 'Duct Setup'] },
        { id: 'fridge', label: 'Refrigerator', icon: 'snowflake', subs: ['Single Door', 'Double Door', 'Deep Freezer'] },
        { id: 'oven', label: 'Microwave/Oven', icon: 'microwave', subs: ['Heating Issue', 'Panel Repair', 'Standard Service'] },
        { id: 'washing', label: 'Washing Machine', icon: 'refresh-cw', subs: ['Top Load', 'Front Load', 'Dryer Repair'] },
        { id: 'geyser', label: 'Geyser Repair', icon: 'thermometer-sun', subs: ['Heating Element', 'Tank Leak', 'Installation'] },
        { id: 'sofa', label: 'Sofa Cleaning', icon: 'sofa', subs: ['Vacuuming', 'Shampooing', 'Dry Cleaning'] },
        { id: 'pest_termite', label: 'Termite Proofing', icon: 'bug', subs: ['Pre-Construction', 'Post-Construction'] },
        { id: 'cockroach', label: 'General Pest', icon: 'bug-off', subs: ['Kitchen Spray', 'Full Home Fogging'] },
        { id: 'water_tank', label: 'Tank Cleaning', icon: 'database', subs: ['UV Treatment', 'Manual Scrub', 'Sludge Removal'] },
        { id: 'yoga', label: 'Yoga Trainer', icon: 'heart', subs: ['Weight Loss', 'Stress Management', 'Therapeutic Yoga'] },
        { id: 'diet', label: 'Dietician', icon: 'apple', subs: ['Weight Gain', 'Medical Diet', 'Sports Nutrition'] },
        { id: 'physio', label: 'Physiotherapist', icon: 'accessibility', subs: ['Post-Surgery', 'Back Pain', 'Stroke Rehab'] },
        { id: 'grooming', label: 'Pet Grooming', icon: 'dog', subs: ['Bath & Brush', 'Nail Trimming', 'Hair Cut'] },
        { id: 'vet', label: 'Veterinary', icon: 'stethoscope', subs: ['Vaccination', 'Checkup', 'Home Visit'] },
        // --- INDUSTRY TITAN EXPANSION (v9.0) ---
        { id: 'hvac_ind', label: 'Industrial HVAC', icon: 'fan', subs: ['Chiller Plant', 'Ducting Pro', 'AHU Service', 'VRV/VRF System', 'Industrial Cooling'] },
        { id: 'warehouse', label: 'Warehouse Sol.', icon: 'layout', subs: ['Racking Install', 'Inventory Mgmt', 'Flooring (Epoxy)', 'Pallet Repair'] },
        { id: 'metal_fab', label: 'Metal Fabrication', icon: 'anvil', subs: ['SS Railing', 'Iron Gates', 'Laser Cutting', 'Structure Welding', 'Shutter Repair'] },
        { id: 'printing', label: 'Printing & Flex', icon: 'printer', subs: ['Flex Banner', 'Vinyl Print', 'Visiting Cards', 'Brochures', '3D Boards'] },
        { id: 'movers', label: 'Packers & Movers', icon: 'truck', subs: ['House Shifting', 'Office Relocation', 'Vehicle Transport', 'Storage Setup'] },
        { id: 'fire_safety', label: 'Fire Safety', icon: 'flame', subs: ['Refilling', 'Fire Audit', 'Sprinkler System', 'Smoke Alarm'] },
        { id: 'solar_pro', label: 'Solar Pro', icon: 'sun', subs: ['Panel Cleaning', 'Inverter Repair', 'Net Metering', 'Capacity Upgrade'] },
        { id: 'automation', label: 'Smart Home', icon: 'house', subs: ['Smart Lighting', 'Voice Control', 'Smart Locks', 'Home Theater'] },
        { id: 'vfx_video', label: 'Video & Photo', icon: 'video', subs: ['Event Shoot', 'Ad Film', 'Product Photo', 'Video Editing'] },
        { id: 'corporate_it', label: 'Corporate IT', icon: 'server', subs: ['Server Setup', 'LAN/WiFi Site', 'Cyber Security', 'AMC (IT)'] },
        { id: 'interior_pro', label: 'Interior Design', icon: 'palette', subs: ['3D Rendering', 'Modular Setup', 'Wall Decor', 'Space Planning'] },
        { id: 'vastu', label: 'Vastu Expert', icon: 'compass', subs: ['Home Vastu', 'Office Vastu', 'Remedies', 'New Map Check'] },
        { id: 'machinery', label: 'Heavy Machinery', icon: 'settings', subs: ['JCB Repair', 'Generator Service', 'Pumps Repair', 'Hydraulic Fix'] },
        { id: 'cleaning_pro', label: 'Industrial Cleaning', icon: 'brush', subs: ['Water Tank (Large)', 'Facade Cleaning', 'Factory Scrubbing', 'Deep Disinfectant'] }
    ],

    // 50+ PRODUCT CATEGORIES WITH SUB-CATEGORIES
    PRODUCT_CATEGORIES: [
        {
            id: 'construction', label: 'Construction', label_hi: 'बिल्डिंग सामान (Construction)', icon: 'brick-wall',
            subs: ['ACC Cement', 'TMT Bars (Sariya)', 'Red Bricks', 'Sand/Bajri', 'Stone Chips', 'Ultratech', 'Birla Gold', 'Paints/Putty'],
            subs_hi: ['एसीसी सीमेंट', 'सरिया (TMT Bars)', 'लाल ईंटें', 'बालू/बजरी', 'गिट्टी', 'अल्ट्राटेक', 'बिरला गोल्ड', 'पेंट/पुट्टी']
        },
        {
            id: 'cement', label: 'Cement & Binding', label_hi: 'सीमेंट और बाइंडिंग', icon: 'package-plus',
            subs: ['OPC 43/53', 'PPC Cement', 'White Cement', 'Wall Putty', 'Adhesives'],
            subs_hi: ['ओपीसी ४३/५३', 'पीपीसी सीमेंट', 'सफेद सीमेंट', 'वॉल पुट्टी', 'चिपकाने वाला सामान']
        },
        {
            id: 'hardware', label: 'Hardware', label_hi: 'हार्डवेयर (Hardware)', icon: 'wrench',
            subs: ['Locks/Handles', 'Nails & Screws', 'Power Tools', 'Hinges', 'Hand Tools', 'Pipes & Fittings'],
            subs_hi: ['ताले/हैंडल', 'कीले और पेंच', 'पावर टूल्स', 'कब्जे', 'हाथ के औजार', 'पाइप फिटिंग']
        },
        {
            id: 'electrical_sales', label: 'Electric Shop', label_hi: 'बिजली का सामान', icon: 'plug',
            subs: ['Cables & Wires', 'Modular Switches', 'LED Lights', 'MCB/DB', 'Fans', 'Conduits'],
            subs_hi: ['तार और केबल', 'मॉड्यूलर स्विच', 'एलईडी लाइट्स', 'एमसीबी', 'पंखे', 'कौंडुइट्स']
        },
        {
            id: 'sanitary', label: 'Sanitaryware', label_hi: 'सेनेटरी का सामान', icon: 'bath',
            subs: ['Basins', 'Commodes', 'Taps & Showers', 'PVC Pipes', 'Kitchen Sinks', 'Accessories'],
            subs_hi: ['वॉश बेसिन', 'कमोड/सीट', 'नल और शावर', 'पीवीसी पाइप', 'किचन सिंक', 'एक्सेसरीज']
        },
        {
            id: 'electronics', label: 'Electronics', label_hi: 'इलेक्ट्रॉनिक्स', icon: 'laptop',
            subs: ['Smartphones', 'Laptops', 'Tablets', 'Headphones', 'Smartwatches', 'Cameras'],
            subs_hi: ['स्मार्टफोन', 'लैपटॉप', 'टैबलेट', 'हेडफोन', 'स्मार्टवॉच', 'कैमरा']
        },
        {
            id: 'furniture_sales', label: 'Furniture', label_hi: 'फर्नीचर', icon: 'armchair',
            subs: ['Solid Wood Bed', 'Office Chairs', 'Dining Set', 'Almirah', 'Sofa Set', 'Study Table'],
            subs_hi: ['बेड (Bed)', 'ऑफिस कुर्सी', 'डाइनिंग सेट', 'अलमारी', 'सोफा सेट', 'स्टडी टेबल']
        },
        {
            id: 'supermarket', label: 'Grocery / FMCG', label_hi: 'किराना / सुपरमार्केट', icon: 'shopping-cart',
            subs: ['Rice & Dal', 'Oil & Masala', 'Beverages', 'Cleaning Items', 'Personal Care', 'Snacks'],
            subs_hi: ['चावल और दाल', 'तेल और मसाला', 'कोल्ड ड्रिंक्स', 'सफाई का सामान', 'पर्सनल केयर', 'स्नैक्स']
        },
        {
            id: 'fashion', label: 'Fashion', label_hi: 'फैशन / कपड़े', icon: 'shirt',
            subs: ['Men Clothing', 'Women Ethnic', 'Footwear', 'Watches', 'Bags & Wallets'],
            subs_hi: ['पुरुषों के कपड़े', 'महिलाओं के कपड़े', 'जूते/चप्पल', 'घड़ियाँ', 'बैग और वॉलेट']
        },
        {
            id: 'stationery', label: 'Books & Stationery', label_hi: 'किताबें और स्टेशनरी', icon: 'pen-tool',
            subs: ['Office Supply', 'School Books', 'Art Materials', 'Calculators', 'Gift Items'],
            subs_hi: ['ऑफिस का सामान', 'स्कूल की किताबें', 'आर्ट का सामान', 'कैलकुलेटर', 'गिफ्ट आइटम']
        },
        {
            id: 'agriculture', label: 'Agri & Farming', label_hi: 'खेती किसानी', icon: 'sprout',
            subs: ['Seeds', 'Fertilizer', 'Pesticides', 'Agri Tools', 'Irrigation Pipes'],
            subs_hi: ['बीज', 'खाद', 'कीटनाशक', 'खेती के औजार', 'सिंचाई पाइप']
        },
        {
            id: 'tiles', label: 'Tiles & Marble', label_hi: 'टाइल्स और पत्थर', icon: 'grid',
            subs: ['Vitrified Tiles', 'Ceramic Walls', 'Marble Slabs', 'Granite', 'Tile Epoxy'],
            subs_hi: ['विट्रीफाइड टाइल्स', 'सेरामिक दीवार', 'मार्बल', 'ग्रेनाइट', 'टाइल्स इपॉक्सी']
        },
        {
            id: 'mobile_acc', label: 'Mobile Access.', label_hi: 'मोबाइल एक्सेसरीज', icon: 'phone-incoming',
            subs: ['Charger', 'Back Cover', 'Tempered Glass', 'Powerbank'],
            subs_hi: ['चार्जर', 'बैक कवर', 'टेंपर्ड ग्लास', 'पावर बैंक']
        },
        {
            id: 'kitchen', label: 'Kitchenware', label_hi: 'रसोई का सामान', icon: 'utensils',
            subs: ['Mixer/Grinder', 'Gas Stove', 'Cooker Set', 'Glassware'],
            subs_hi: ['मिक्सर/ग्राइंडर', 'गैस चूल्हा', 'कुकर सेट', 'कांच का सामान']
        },
        { id: 'auto_parts', label: 'Auto Parts', icon: 'settings', subs: ['Engine Oil', 'Tyre/Tube', 'Filters', 'Brake Pads', 'Batteries'] },
        { id: 'toys', label: 'Toys & Gifts', icon: 'gift', subs: ['Electric Cars', 'Educational Toys', 'Board Games', 'Soft Toys'] },
        { id: 'sports', label: 'Sports Equipment', icon: 'trophy', subs: ['Cricket Kit', 'Gym Weights', 'Badminton', 'Cycles'] },
        { id: 'medical', label: 'Medical Supply', icon: 'plus-square', subs: ['Surgical Masks', 'Wheelchairs', 'First Aid', 'Oxygen Cans'] },
        { id: 'industrial', label: 'Industrial Goods', icon: 'factory', subs: ['Welding Machine', 'Bearings', 'Generators', 'Safety Shoes'] },
        { id: 'decor', label: 'Home Decor', icon: 'palette', subs: ['Wall Clocks', 'Curtains', 'Artificial Plants', 'Paintings'] },
        { id: 'pet', label: 'Pet Supplies', icon: 'dog', subs: ['Dog Food', 'Cat Litter', 'Aquariums', 'Bird Seed'] },
        { id: 'bakery', label: 'Bakery Supply', icon: 'cookie', subs: ['Premixes', 'Decorations', 'Packaging', 'Essences'] },
        { id: 'plastic', label: 'Plastic Ware', icon: 'beaker', subs: ['Storage Bins', 'Water Buckets', 'Storage Tanks'] },
        { id: 'pipes', label: 'Plumbing Pipes', icon: 'activity', subs: ['CPVC', 'UPVC', 'SWR Pipes', 'Column Pipes'] },
        { id: 'scaffolding', label: 'Scaffolding', icon: 'layers', subs: ['Props/Jacks', 'MS Plates', 'Cuplock System'] },
        { id: 'solar_product', label: 'Solar Systems', icon: 'sun-medium', subs: ['Solar Panels', 'Inverters', 'Street Lights'] },
        { id: 'glass', label: 'Glass & Mirror', icon: 'square', subs: ['Toughened Glass', 'Designer Mirror', 'Window Glass'] },
        { id: 'safety', label: 'Safety Gear', icon: 'hard-hat', subs: ['Jackets', 'Safety Gloves', 'Fire Extinguisher'] },
        { id: 'lighting', label: 'Luxury Light', icon: 'lamp', subs: ['Chandeliers', 'Wall Lights', 'Garden Light'] },
        { id: 'packaging', label: 'Packaging', icon: 'box', subs: ['Corrugated Boxes', 'Tape', 'Bubble Wrap'] },
        { id: 'generators', label: 'Generators', icon: 'battery-charging', subs: ['Kirloskar', 'Honda', 'Silent DG', 'Home UPS'] },
        { id: 'batteries', label: 'Inverters/Batteries', icon: 'battery', subs: ['Tall Tubular', 'Flat Plate', 'Solar Hybrid'] },
        { id: 'computer_shop', label: 'Computer Shop', icon: 'monitor', subs: ['Desktop PC', 'Graphics Card', 'RAM/SSD', 'WiFi Router'] },
        { id: 'cctv_kit', label: 'CCTV Kits', icon: 'video', subs: ['IP Camera', 'Analog Kit', 'Domes', 'Network Video'] },
        { id: 'locks', label: 'Smart Locks', icon: 'key', subs: ['Biometric', 'Password Lock', 'RFID Card'] },
        { id: 'wallpapers', label: 'Wall Decor', icon: 'image', subs: ['3D Wallpaper', 'Vertical Garden', 'Foam Tiles'] },
        { id: 'ceiling', label: 'False Ceiling', icon: 'panel-top', subs: ['POP Design', 'PVC Ceiling', 'Gypsum Board'] },
        { id: 'flooring', label: 'Wooden Floor', icon: 'align-justify', subs: ['Laminate', 'Solid Wood', 'Vinyl Planks'] },
        { id: 'aluminum', label: 'Aluminum Work', icon: 'columns', subs: ['Sliding Windows', 'Partitions', 'Paneling'] },
        { id: 'paints', label: 'Paints & Polish', icon: 'spray-can', subs: ['Asian Paints', 'Berger', 'Nerolac', 'Enamel'] },
        // --- INDUSTRY TITAN EXPANSION (v9.0) ---
        { id: 'steel_bulk', label: 'Bulk Steel', icon: 'server', subs: ['I-Beams', 'Channel Section', 'Angle Iron', 'MS Flat', 'GI Sheets', 'Chequered Plate'] },
        { id: 'chemicals', label: 'Bulk Chemicals', icon: 'test-tube', subs: ['Industrial Acids', 'Solvents', 'Coolants', 'Cleaning Agents', 'Boiler Chemicals'] },
        { id: 'lab_equip', label: 'Lab & Science', icon: 'flask-conical', subs: ['Microscopes', 'Glassware', 'Testing Kits', 'Lab Reagents', 'Equip. Maint.'] },
        { id: 'surgical', label: 'Surgical Supply', icon: 'plus-circle', subs: ['Operation Tools', 'Disposable Kits', 'Clinic Gears', 'Sanitizers'] },
        { id: 'solar_bat', label: 'Solar Storage', icon: 'battery-charging', subs: ['Lithium Packs', 'Deep Cycle Gel', 'Lead Acid (Pro)', 'Rack Systems'] },
        { id: 'net_gear', label: 'Network Gear', icon: 'router', subs: ['Enterprise Switches', 'Rack Servers', 'Patch Panels', 'Network Cables'] },
        { id: 'corp_gift', label: 'Corp. Gifting', icon: 'gift', subs: ['Custom Diaries', 'Branded Kits', 'Awards', 'Tech Combos'] },
        { id: 'ppe_safety', label: 'PPE & Safety', icon: 'hard-hat', subs: ['Industrial Boots', 'High-Vis Jackets', 'Safety Helmets', 'Gloves (Bulk)', 'Goggles'] },
        { id: 'workstations', label: 'Office Tech', icon: 'layout', subs: ['Modular Desks', 'Ergo Chairs', 'Partitioning', 'Cabinets'] },
        { id: 'industrial_lub', label: 'Oil & Lubes', icon: 'droplet', subs: ['Engine Oil (Bulk)', 'Hydraulic Oil', 'Grease', 'Gear Oil'] },
        { id: 'bearings', label: 'Mechanical Parts', icon: 'cog', subs: ['Ball Bearings', 'V-Belts', 'Chains', 'Pulleys', 'Couplings'] },
        { id: 'welding_bulk', label: 'Welding Supply', icon: 'zap', subs: ['Electrodes', 'MIG Wires', 'Gas Cylinders', 'Regulators'] },
        { id: 'hv_cables', label: 'Power Cables', icon: 'cable', subs: ['Armoured Cables', 'Panel Wires', 'High Voltage', 'Underground'] },
        { id: 'compressors', label: 'Air Systems', icon: 'wind', subs: ['Screw Compressor', 'Recipro Compressor', 'Receivers', 'Air Dryers'] },
        { id: 'racking', label: 'Storage Systems', icon: 'layers', subs: ['Heavy Duty Racks', 'Slotted Angle', 'Bin Systems', 'Logistics Prep'] }
    ],

    FORM_FIELDS: {
        common: [
            { name: 'fullName', label: 'Full Name / पूरा नाम', type: 'text', placeholder: 'Enter your name', required: true },
            { name: 'phone', label: 'Mobile Number / मोबाइल नंबर', type: 'tel', placeholder: '10-digit mobile number', required: true },
            { name: 'location', label: 'Your Locality / आपका इलाका', type: 'text', placeholder: 'e.g. Nagar Palika Road', required: true }
        ],
        service: [
            { name: 'urgency', label: 'When do you need it? / कब काम चाहिए?', type: 'select', options: ['Immediately / अभी', 'Within 24 Hours / २४ घंटे में', 'Planning (Flexible) / प्लानिंग'] },
            { name: 'details', label: 'Problem Details / समस्या की जानकारी', type: 'textarea', placeholder: 'Explain what needs to be fixed...' }
        ],
        product: [
            { name: 'quantity', label: 'Required Quantity / कितनी मात्रा?', type: 'text', placeholder: 'e.g. 50 Bags, 2 Tons' },
            { name: 'notes', label: 'Specific Requirements / खास निर्देश', type: 'textarea', placeholder: 'Mention brands or preferences...' }
        ]
    },

    /**
     * LOCALIZATION DICTIONARY (v8.0)
     * Features 'Familiar' local terminology.
     */
    TRANSLATIONS: {
        en: {
            brand_name: "ADOCA",
            tagline: "Verified Mastery. Pure Speed.",
            sub_tagline: "India's first Quantum Marketplace for verified experts and industrial supply.",
            nav_home: "Nexus",
            nav_experts: "Experts",
            nav_supply: "Supply",
            nav_support: "Support",
            search_placeholder: "Search for 'Electrician', 'Cement'...",
            trending: "Trending Bazaar",
            trust_shield: "The Quantum Shield",
            trust_desc: "Every request is manually filtered for 100% quality assurance.",
            back: "BACK",
            hub: "NEXUS HUB",
            confirm: "CONFIRM INQUIRY",
            submit: "LOG QUANTUM REQUEST",
            processing: "PROCESSING...",
            verified: "Verified.",
            success_msg: "Case assigned to supervisor. Wait for call.",
            experts_title: "Expert Panel",
            supply_title: "Supply Catalog",
            contact_title: "Nexus Support",
            contact_desc: "We are available 24/7 for Adoca Partners.",
            // --- TITAN EVOLUTION (v9.0) ---
            how_it_works: "How It Works",
            safety_nexus: "Safety Nexus",
            popular_searches: "Popular Searches",
            verified_pro: "Verified Professional",
            elite_partner: "Elite Industrial Partner",
            view_details: "View Technical Details",
            process_step_1: "Request Lodged",
            process_step_2: "Expert Assigned",
            process_step_3: "Work Verified"
        },
        hi: {
            brand_name: "ADOCA",
            tagline: "भरोसेमंद काम। सुपर स्पीड।",
            sub_tagline: "विशेषज्ञों (Experts) और सामान की सप्लाई के लिए भारत का पहला 'क्वांटम' बाज़ार।",
            nav_home: "होम",
            nav_experts: "कारीगर",
            nav_supply: "सामान",
            nav_support: "मदत",
            search_placeholder: "'बिजलीवाला', 'सीमेंट' सर्च करें...",
            trending: "आज की मांग (Trending)",
            trust_shield: "अडोका भरोसा (Shield)",
            trust_desc: "हर काम की क्वालिटी की जांच हमारी टीम खुद करती है।",
            back: "पीछे",
            hub: "मेन मेन्यू",
            confirm: "बुकिंग कन्फर्म करें",
            submit: "रिक्वेस्ट भेजें",
            processing: "प्रोसेस हो रहा है...",
            verified: "कन्फर्म हो गया!",
            success_msg: "आपकी रिक्वेस्ट सुपरवाइजर को मिल गयी है। कृपया कॉल का इंतज़ार करें।",
            experts_title: "एक्सपर्ट कारीगर",
            supply_title: "सामान का कैटलॉग",
            contact_title: "अडोका हेल्प सेंटर",
            contact_desc: "हम अडोका पार्टनर्स के लिए २४/७ तैयार हैं।",
            // --- TITAN EVOLUTION (v9.0) ---
            how_it_works: "यह काम कैसे करता है?",
            safety_nexus: "सुरक्षा और भरोसा",
            popular_searches: "लोग ये ज़्यादा खोज रहे हैं",
            verified_pro: "सर्टिफाइड प्रोफेशनल",
            elite_partner: "एलीट इंडस्ट्रियल पार्टनर",
            view_details: "पूरी जानकारी देखें",
            process_step_1: "रिक्वेस्ट दर्ज हुई",
            process_step_2: "एक्सपर्ट नियुक्त हुआ",
            process_step_3: "काम सफलतापूर्वक पूरा"
        }
    },

    TESTIMONIALS: [
        { name: "Rahul Singh", role: "Builder", text: "Ordered 200 bags of cement via Adoca. Got it delivered within 3 hours at site price!" },
        { name: "Anita Devi", role: "Homeowner", text: "Electrician arrived in 20 mins. Very professional and transparent billing. Highly recommended." },
        { name: "Mohan Lal", role: "Retailer", text: "The bulk buy feature helps me stock my shop without visiting the market daily. Great savings." },
        { name: "Priya Sharma", role: "Working Prof.", text: "Best hyperlocal app for Samastipur. Fast and reliable support always." }
    ],

    FAQ: [
        { q: "Is service guaranteed?", a: "Adoca manually verifies every professional. We guarantee work quality or we fix it." },
        { q: "How to pay?", a: "Pay directly to the provider/seller after work completion or delivery. No advance needed." },
        { q: "Are prices fair?", a: "Since you talk directly to local experts, you get negotiated market rates without hidden app commissions." },
        { q: "What is bulk buy?", a: "Specially for construction and retail where high-volume purchase gets you wholesale rates." }
    ]
};
