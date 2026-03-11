class CustomerModel {
  final String id;
  final String userId;
  final String businessId;
  final String name;
  final String? phone;
  final String? email;
  final String? address;
  final String? notes;
  final DateTime createdAt;

  CustomerModel({
    required this.id,
    required this.userId,
    required this.businessId,
    required this.name,
    this.phone,
    this.email,
    this.address,
    this.notes,
    required this.createdAt,
  });

  factory CustomerModel.fromJson(Map<String, dynamic> json) {
    return CustomerModel(
      id: json['id'] ?? json['_id'],
      userId: json['userId'],
      businessId: json['businessId'],
      name: json['name'],
      phone: json['phone'],
      email: json['email'],
      address: json['address'],
      notes: json['notes'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'businessId': businessId,
      'name': name,
      'phone': phone,
      'email': email,
      'address': address,
      'notes': notes,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
