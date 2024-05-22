import 'package:portfolio/constants/images.dart';

import '../constants/project_links.dart';

class ProjectUtils {
  final String image;
  final String title;
  final String subTitle;
  final String? androidLink;
  final String? iOSLink;
  final String? webLink;

  ProjectUtils({
    required this.image,
    required this.title,
    required this.subTitle,
    this.androidLink,
    this.iOSLink,
    this.webLink,
  });
}
  //############
// Hobby Projects
  List<ProjectUtils> hobbyProjects = [];

//#######
// work Projects
  List<ProjectUtils> workProjects = [
    ProjectUtils(
      image: dafric,
      title: 'Dafric',
      subTitle: 'Used by partners to track Dafric vehicles/fleets.',
      androidLink: dafricLink,
    ),
    ProjectUtils(
      image: dafricCargo,
      title: "Dafric Cargo",
      subTitle: 'A Dafric Logistics client app to help manage their client orders',
      androidLink: dafricCargoFlow,
    ),
    ProjectUtils(
      image: dafricDriver,
      title: "Dafric Driver",
      subTitle: "Help's manage drivers and allocated vehicle",
      androidLink: dafricDriverLink,
    ),
    ProjectUtils(
      image: dafricPartner,
      title: "Dafric Partner",
      subTitle: "Keeps track of job progress,and payments",
      androidLink: dafricPartnerLink,
    ),
    ProjectUtils(
      image: lctAfrica,
      title: "LCT Africa",
      subTitle: 'gives users the ability to keep track of their health insurance',
      androidLink: lctLink,
    ),
    ProjectUtils(
      image: myHealth,
      title: "MY1 HEALTH",
      subTitle: 'enables you to conveniently find the right medical specialist.',
      androidLink: myHealthLink,
    ),
  ];

