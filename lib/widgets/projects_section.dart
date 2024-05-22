import 'package:flutter/material.dart';
import 'package:portfolio/widgets/project_card.dart';

import '../constants/colors.dart';
import '../utils/project_utils.dart';
class ProjectsSection extends StatelessWidget {
  const ProjectsSection({super.key});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    return  Container(
      width: screenWidth,
      padding: const EdgeInsets.fromLTRB(25, 20, 25, 60),
      child: Column(
        children: [
          //work Projects Title,

          //copy from here -----
          const Text(
            "Work Projects",
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: CustomColor.whitePrimary,
            ),
          ),
          const SizedBox(height: 50,),
          //work projects Card
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 900),
            child: Wrap(
              spacing: 25,
              runSpacing: 25,
              children: [
                for (int i = 0; i < workProjects.length; i++)
                  ProjectCard(project: workProjects[i],),
              ],
            ),
          ),
          const SizedBox(height: 50,),

          //Hobby Projects Title,

          const Text(
            "Hobby Projects",
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: CustomColor.whitePrimary,
            ),
          ),
          const SizedBox(height: 50,),

          //Hobby projects Card
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 900),
            child: Wrap(
              spacing: 25,
              runSpacing: 25,
              children: [
                for (int i = 0; i < hobbyProjects.length; i++)
                  ProjectCard(project: hobbyProjects[i],),
              ],
            ),
          )

        ],
      ),
    );
  }
}
