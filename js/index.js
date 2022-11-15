"use strict";

var myApp = angular.module("myApp", []);

myApp.controller("globeGL", function ($scope, $http) {
  $scope.globeGL = {};

  // Variables
  $scope.globeGL.selectedTexture = "Land Surface Temperature";
  $scope.globeGL.selectedTextureImg =
    "./textures/land-surface-temperature.jpeg";
  $scope.globeGL.selectedDescription =
    "Land surface temperature is how hot the ground feels to the touch. If you want to know whether temperatures at some place at a specific time of year are unusually warm or cold, you need to compare them to the average temperatures for that place over many years. These maps show the average weekly or monthly daytime land surface temperatures for 2001-2010.";

  $scope.globeGL.textures = [
    {
      name: "Land Surface Temperature",
      icon: "./icons/temperature.svg",
      textureImg: "./textures/land-surface-temperature.jpeg",
      description:
        "Land surface temperature is how hot the ground feels to the touch. If you want to know whether temperatures at some place at a specific time of year are unusually warm or cold, you need to compare them to the average temperatures for that place over many years. These maps show the average weekly or monthly daytime land surface temperatures for 2001-2010.",
    },
    {
      name: "Cloud Fraction",
      icon: "./icons/clouds.svg",
      textureImg: "./textures/cloud-fraction.jpeg",
      description:
        "Looking at Earth from outer space, clouds are easy to spot. Clouds are draped all around Earth like bright white decorations. Clouds are important to scientists because they reflect the Sun's light back to space and give shade to the surface. They also bring rain, which is important because all plants and animals need freshwater to live. These maps made from NASA satellite observations show how much of Earth's surface is covered by clouds for a given day, or over a span of days.",
    },
    {
      name: "Population Density",
      icon: "./icons/population-density.svg",
      textureImg: "./textures/population-density.jpeg",
      description:
        'This map shows how many people live in different areas on Earth. The map is divided into numerous small boxes, called "grids." Each grid box is about 1 kilometer long by one kilometer wide, and it is color coded to show how many people live there. Lighter areas have fewer people. The red dots scattered across most countries show cities, where many people live in a small area.',
    },
    {
      name: "Leaf Area Index",
      icon: "./icons/leaf-area-index.svg",
      textureImg: "./textures/leaf-area-index.jpeg",
      description:
        "Have you ever flown in a plane over a forest, or seen a picture of a forest canopy taken from above? If so, you probably noticed the forest canopy was colored shades of dark green. The trees' and plants' leaves give the forest its lush green appearance. The more leaves there are in a forested area, the greener the tree canopy. Have you ever wondered how many leaves there are in a forest? Today, scientists use NASA satellites to map leaf area index — images processed to show how much of an area is covered by leaves. For example, a leaf area index of one means the area is entirely covered by one layer of leaves. Knowing the total area covered by leaves helps scientists monitor how much water, carbon, and energy the trees and plants are exchanging with the air above and the ground below.",
    },
    {
      name: "Vegetation Index",
      icon: "./icons/vegetation-index.svg",
      textureImg: "./textures/vegetation-index.jpeg",
      description:
        'Our lives depend upon plants and trees. They feed us and give us clothes. They absorb carbon dioxide and give off oxygen we need to breathe. Plants even provide many of our medicines and building materials. So when the plants and trees around us change, these changes can affect our health, our environment, and our economy. For these reasons, and more, scientists monitor plant life around the world. Today, scientists use NASA satellites to map the "greenness" of all Earth\'s lands. These vegetation index maps show where and how much green leaf vegetation was growing for the time period shown.',
    },
    {
      name: "Albedo",
      icon: "./icons/albedo.svg",
      textureImg: "./textures/albedo.jpeg",
      description:
        "When sunlight reaches the Earth’s surface, some of it is absorbed and some is reflected. The relative amount (ratio) of light that a surface reflects compared to the total sunlight that falls on it is called albedo. Surfaces that reflect a lot of the light falling on them are bright, and they have a high albedo. Surfaces that don’t reflect much light are dark, and they have a low albedo. Snow has a high a albedo, and forests have a low albedo.",
    },
    {
      name: "Sea Surface Temperature",
      icon: "./icons/sea-surface-temperature.svg",
      textureImg: "./textures/sea-surface-temperature.jpeg",
      description:
        "Sea surface temperature is the temperature of the top millimeter of the ocean's surface. Sea surface temperatures influence weather, including hurricanes, as well as plant and animal life in the ocean. Like Earth's land surface, sea surface temperatures are warmer near the equator and colder near the poles. Currents like giant rivers move warm and cold water around the world's oceans. Some of these currents flow on the surface, and they are obvious in sea surface temperature images. Warm ocean waters help form clouds and affect weather patterns. The sea's surface temperature is also correlated to the availability of tiny ocean plants, called phytoplankton. For all of these reasons scientists monitor the sea's surface temperature. These maps show satellite measurements of the sea's surface temperature for a given day, or for a span of days.",
    },
    {
      name: "Chlorophyll Concentration",
      icon: "./icons/chlorophyll-concentration.svg",
      textureImg: "./textures/chlorophyll-concentration.jpeg",
      description:
        "This map shows where tiny, floating plants live in the ocean. These plants, called phytoplankton, are an important part of the ocean's food chain because many animals (such as small fish and whales) feed on them. Scientists can learn a lot about the ocean by observing where and when phytoplankton grow in large numbers. Scientists use satellites to measure how much phytoplankton are growing in the ocean by observing the color of the light reflected from the shallow depths of the water. Phytoplankton contain a photosynthetic pigment called chlorophyll that lends them a greenish color. When phytoplankton grow in large numbers they make the ocean appear greenish. These maps made from satellite observations show where and how much phytoplankton were growing on a given day, or over a span of days. The black areas show where the satellite could not measure phytoplankton.",
    },
  ];

  // Functions
  $scope.globeGL.changeTexture = changeTexture;

  function changeTexture(texture) {
    $scope.globeGL.selectedTexture = texture.name;
    $scope.globeGL.selectedTextureImg = texture.textureImg;
    $scope.globeGL.selectedDescription = texture.description;

    paint();
  }

  function paint() {
    var container = document.getElementById("container");
    var globe = new DAT.Globe(container, {
      textureImg: $scope.globeGL.selectedTextureImg,
    });

    TWEEN.start();

    globe.animate();
    document.body.style.backgroundImage = "none";
  }

  function initialize() {
    if (!Detector.webgl) {
      Detector.addGetWebGLMessage();
    } else {
      paint();
    }
  }

  // window.addEventListener('resize', function() {
  //     // TODO keep selected image
  //     initialize();
  // });

  initialize();
});
