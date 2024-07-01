import 'package:flutter/material.dart';
import 'package:portfolio/utils/project_utils.dart';

import '../constants/colors.dart';
import '../constants/images.dart';
import 'dart:js' as js;

class ProjectCard extends StatelessWidget {
  const ProjectCard({
    super.key, required this.project,
  });

  final ProjectUtils project;

  @override
  Widget build(BuildContext context) {
    return Container(
      clipBehavior: Clip.antiAlias,
      height: 290,
      width: 260,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10.0),
        color: CustomColor.bgLight2,
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Image.asset(
            project.image,
            height: 140,
            width: 260,
            fit: BoxFit.fill,
          ),
          //title
          Padding(
            padding:
            const EdgeInsets.fromLTRB(12.0, 15, 12, 15),
            child: Text(
              project.title,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: CustomColor.whitePrimary,
              ),
            ),
          ),
          //subtitle
          Padding(
            padding: const EdgeInsets.fromLTRB(12.0, 0, 12, 12),
            child: Text(
              project.subTitle,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: CustomColor.whitePrimary,
              ),
            ),
          ),
          const Spacer(),
          //footer
          Container(
            width: double.infinity,
            height: 30,
            color: CustomColor.bgLight1,
            margin: const EdgeInsets.symmetric(
                vertical:2 ),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12,),
              child: Row(
                children: [
                  const Text(
                    "Available on: ",
                    style: TextStyle(
                      color: CustomColor.yellowSecondary,
                      fontSize: 10,),
                  ),
                  const Spacer(),
                  if(project.androidLink != null)
                  Padding(
                    padding: const EdgeInsets.only(left: 6.0),
                    child: InkWell(
                      onTap: (){
                        js.context.callMethod("open",[project.androidLink]);
                      },
                      child: Image.asset(
                        android,
                        width: 16,
                      ),
                    ),
                  ),
                  if(project.iOSLink != null)
                  Padding(
                    padding: const EdgeInsets.only(left: 6.0),
                    child: InkWell(
                      onTap: (){
                        js.context.callMethod("open",[project.iOSLink]);
                      },
                      child: Image.asset(
                        apple,
                        width: 17,
                      ),
                    ),
                  ),
                  if(project.webLink != null)
                  Padding(
                    padding: const EdgeInsets.only(left: 6.0),
                    child: InkWell(
                      onTap: (){
                        js.context.callMethod("open",[project.webLink]);
                      },
                      child: Image.asset(
                        web,
                        width: 16,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}