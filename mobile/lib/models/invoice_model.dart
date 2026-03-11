class InvoiceItemModel {
  final String name;
  final int quantity;
  final double price;
  final double total;

  InvoiceItemModel({
    required this.name,
    required this.quantity,
    required this.price,
    required this.total,
  });

  factory InvoiceItemModel.fromJson(Map<String, dynamic> json) {
    return InvoiceItemModel(
      name: json['name'],
      quantity: json['quantity'] ?? 1,
      price: (json['price'] ?? 0).toDouble(),
      total: (json['total'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'quantity': quantity,
      'price': price,
      'total': total,
    };
  }
}

class InvoiceModel {
  final String id;
  final String userId;
  final String businessId;
  final String customerId;
  final String invoiceNumber;
  final DateTime issueDate;
  final DateTime dueDate;
  final String status; // draft, sent, paid, overdue
  final List<InvoiceItemModel> items;
  final double subtotal;
  final double tax;
  final double discount;
  final double total;
  final String? notes;
  final DateTime createdAt;

  InvoiceModel({
    required this.id,
    required this.userId,
    required this.businessId,
    required this.customerId,
    required this.invoiceNumber,
    required this.issueDate,
    required this.dueDate,
    required this.status,
    required this.items,
    required this.subtotal,
    required this.tax,
    required this.discount,
    required this.total,
    this.notes,
    required this.createdAt,
  });

  factory InvoiceModel.fromJson(Map<String, dynamic> json) {
    var itemsList = json['items'] as List? ?? [];
    List<InvoiceItemModel> parsedItems =
        itemsList.map((item) => InvoiceItemModel.fromJson(item)).toList();

    return InvoiceModel(
      id: json['id'] ?? json['_id'],
      userId: json['userId'],
      businessId: json['businessId'],
      customerId: json['customerId'],
      invoiceNumber: json['invoiceNumber'],
      issueDate: DateTime.parse(json['issueDate']),
      dueDate: DateTime.parse(json['dueDate']),
      status: json['status'] ?? 'draft',
      items: parsedItems,
      subtotal: (json['subtotal'] ?? 0).toDouble(),
      tax: (json['tax'] ?? 0).toDouble(),
      discount: (json['discount'] ?? 0).toDouble(),
      total: (json['total'] ?? 0).toDouble(),
      notes: json['notes'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'businessId': businessId,
      'customerId': customerId,
      'invoiceNumber': invoiceNumber,
      'issueDate': issueDate.toIso8601String(),
      'dueDate': dueDate.toIso8601String(),
      'status': status,
      'items': items.map((e) => e.toJson()).toList(),
      'subtotal': subtotal,
      'tax': tax,
      'discount': discount,
      'total': total,
      'notes': notes,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
