import 'dart:convert';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import '../constants/network.dart';

class SendEmailService {

  static sendMail({
    required String name,
    required String email,
    required String subject,
    required String message,
  }) async {
    try {
      var endpointUrl = Uri.parse(uri);

      var response = await http.post(endpointUrl,
        headers: {
          'Content-Type': header
        },
        body: jsonEncode({
          'service_id': serviceId,
          'template_id': templateId,
          'user_id': userId,
          'template_params': {
            'user_name': name,
            'user_email': email,
            'user_subject': subject,
            'user_message': message,
          }
        }),
      );
      if (response.statusCode == 200) {
        debugPrint(response.body);
      }
    } catch (e) {
      debugPrint(e.toString());
    }
  }
}