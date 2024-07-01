import 'package:flutter/material.dart';
import 'package:portfolio/constants/images.dart';
//import 'package:portfolio/services/email_service.dart'; // Fixed typo

import '../constants/colors.dart';
import '../constants/size.dart';
import '../constants/sns_links.dart';
import '../services/email_serrvice.dart';
import '../utils/app_input.dart';
import '../utils/custom_text_field.dart';

import 'dart:js' as js;

class ContactSection extends StatefulWidget {
  const ContactSection({super.key});

  @override
  State<ContactSection> createState() => _ContactSectionState();
}

class _ContactSectionState extends State<ContactSection> {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController subjectController = TextEditingController();
  final TextEditingController messageController = TextEditingController();

  bool isLoading = false; // Added this line

  final GlobalKey<FormState> _formKey = GlobalKey<FormState>(); // Added this line

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(25, 20, 25, 60),
      color: CustomColor.bgLight1,
      child: Column(
        children: [
          // title
          const Text(
            "Get in touch",
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 24,
              color: CustomColor.whitePrimary,
            ),
          ),
          const SizedBox(height: 50),
          ConstrainedBox(
            constraints: const BoxConstraints(
              maxWidth: 700,
            ),
            child: LayoutBuilder(
              builder: (context, constraints) {
                if (constraints.maxWidth >= minDesktopWidth) {
                  return buildNameEmailFieldDesktop();
                }
                // else
                return buildNameEmailFieldMobile();
              },
            ),
          ),
          const SizedBox(height: 15),
          // message
          ConstrainedBox(
            constraints: const BoxConstraints(
              maxWidth: 700,

            ),
            child: CustomTextField(
              hintText: "Your message",
              controller: messageController,
              maxLines: 16,
            ),
          ),
          const SizedBox(height: 20),
          // send button
          Form( // Wrap ElevatedButton with Form
            key: _formKey,
            child: ConstrainedBox(
              constraints: const BoxConstraints(
                maxWidth: 700,
              ),
              child: SizedBox(
                width: double.maxFinite,
                child: ElevatedButton(
                  onPressed: () async {
                    if (!_formKey.currentState!.validate()) { // Validate form
                      return;
                    }

                    setState(() {
                      isLoading = true; // Show loading indicator
                    });

                    try {
                      await SendEmailService.sendMail(
                        name: nameController.text,
                        email: emailController.text,
                        subject: subjectController.text,
                        message: messageController.text,
                      );
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Email sent successfully')),
                      );
                    } catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Failed to send email')),
                      );
                    } finally {
                      setState(() {
                        isLoading = false; // Hide loading indicator
                      });
                    }
                  },
                  child: isLoading
                      ? const CircularProgressIndicator.adaptive(
                    backgroundColor: Colors.white,
                  )
                      : const Text(
                    "Get in touch",
                    style: TextStyle(color: CustomColor.whitePrimary),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 30),
          ConstrainedBox(
            constraints: const BoxConstraints(
              maxWidth: 300,
            ),
            child: const Divider(),
          ),
          const SizedBox(height: 15),
          const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Icon(Icons.phone_outlined, color: Colors.white, size: 30),
              SizedBox(width: 10),
              Text(
                '+254794227892',
                style: TextStyle(fontSize: 15),
              ),
            ],
          ),
          const SizedBox(height: 15),
          ConstrainedBox(
            constraints: const BoxConstraints(
              maxWidth: 300,
            ),
            child: const Divider(),
          ),
          const SizedBox(height: 15),
          // SNS icon button links
          Wrap(
            spacing: 12,
            runSpacing: 12,
            alignment: WrapAlignment.center,
            children: [
              InkWell(
                onTap: () {
                  js.context.callMethod('open', [SnsLinks.github]);
                },
                child: Image.asset(
                  github,
                  width: 28,
                ),
              ),
              InkWell(
                onTap: () {
                  js.context.callMethod('open', [SnsLinks.linkedIn]);
                },
                child: Image.asset(
                  linkedin,
                  width: 28,
                ),
              ),
              InkWell(
                onTap: () {
                  js.context.callMethod('open', [SnsLinks.tiktok]);
                },
                child: Image.asset(
                  tiktok,
                  width: 28,
                ),
              ),
              InkWell(
                onTap: () {
                  js.context.callMethod('open', [SnsLinks.instagram]);
                },
                child: Image.asset(
                  instagram,
                  width: 28,
                ),
              ),
              InkWell(
                onTap: () {
                  js.context.callMethod('open', [SnsLinks.X]);
                },
                child: Image.asset(
                  X,
                  width: 28,
                ),
              ),
            ],
          )
        ],
      ),
    );
  }

  Widget buildNameEmailFieldDesktop() {
    return Column(
      children: [
        Row(
          mainAxisSize: MainAxisSize.max,
          children: [
            // name
            Flexible(
              child: AppInput(
                label: "Your name",
                type: TextInputType.text,
                controller: nameController,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your name';
                  }
                  return null;
                },
              ),
            ),
            const SizedBox(width: 15),
            // email
            Flexible(
              child: AppInput(
                label: "Your email",
                type: TextInputType.emailAddress,
                controller: emailController,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                    return 'Please enter a valid email';
                  }
                  return null;
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 15),
        AppInput(
          label: "Subject",
          type: TextInputType.text,
          controller: subjectController,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter the subject';
            }
            return null;
          },
        ),
      ],
    );
  }

  Column buildNameEmailFieldMobile() {
    return Column(
      mainAxisSize: MainAxisSize.max,
      children: [
        // name
        AppInput(
          label: "Your name",
          type: TextInputType.text,
          controller: nameController,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter your name';
            }
            return null;
          },
        ),
        const SizedBox(height: 15),
        // subject
        AppInput(
          label: "Subject",
          type: TextInputType.text,
          controller: subjectController,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter the subject';
            }
            return null;
          },
        ),
        const SizedBox(height: 15),
        // email
        AppInput(
          label: "Your email",
          type: TextInputType.emailAddress,
          controller: emailController,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter your email';
            }
            if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
              return 'Please enter a valid email';
            }
            return null;
          },
        ),
      ],
    );
  }
}
