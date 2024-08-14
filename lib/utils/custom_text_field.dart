import 'package:flutter/material.dart';

import '../constants/colors.dart';

class CustomTextField extends StatelessWidget {
  const CustomTextField({
    super.key,
    this.controller,
    this.maxLines = 1,
    this.hintText,
    this.errorText,
  });

  final TextEditingController? controller;
  final int maxLines;
  final String? hintText;
  final String? errorText;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      maxLines: maxLines,
      style: const TextStyle(
        color: CustomColor.whitePrimary,
      ),
      decoration: InputDecoration(
        contentPadding: const EdgeInsets.all(16),
        filled: true,
        fillColor: Colors.transparent,
        focusedBorder: getInputBorder,
        enabledBorder: getInputBorder,
        border: getInputBorder,
        hintText: hintText,
        errorText:errorText,
        hintStyle: const TextStyle(
          color: Color(0xff979797),
        ),
      ),
    );
  }

  OutlineInputBorder get getInputBorder {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(10),
      borderSide: const BorderSide( // Provide a proper BorderSide object
        color:Color(0xffb9b9bb), // Change this to your desired color
        width: 1.0, // Change this to your desired width
      ),
    );
  }
}