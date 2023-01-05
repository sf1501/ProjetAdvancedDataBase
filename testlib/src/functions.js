function interception(proj_pos, plan_pos, plan_vel) {
  // Calculer la distance entre le projectile et la planète
  var distance = Math.sqrt(
    Math.pow(proj_pos[0] - plan_pos[0], 2) +
      Math.pow(proj_pos[1] - plan_pos[1], 2)
  );

  // Calculer le vecteur de vitesse du projectile
  var velocity = [
    plan_vel[0] + Math.sqrt((2 * distance) / (distance / plan_vel[0] + 1)),
    plan_vel[1] + Math.sqrt((2 * distance) / (distance / plan_vel[1] + 1)),
  ];

  // Calculer l'angle de vitesse du projectile
  var angle = Math.atan2(velocity[1], velocity[0]);

  return [angle, velocity];
}

function interceptAngleAndSpeed(
  projectilePosition,
  planetPosition,
  planetVelocity
) {
  // Calculer la distance entre le projectile et la planète
  let distance = Math.sqrt(
    Math.pow(projectilePosition.x - planetPosition.x, 2) +
      Math.pow(projectilePosition.y - planetPosition.y, 2)
  );

  // Calculer le vecteur vitesse du projectile
  // Vecteur vitesse = vecteur tangent à l'ellipse à l'instant initial + vecteur vitesse de la planète
  let projectileVelocity = {
    x:
      ((projectilePosition.x - planetPosition.x) / distance) *
        planetVelocity.x +
      planetVelocity.x,
    y:
      ((projectilePosition.y - planetPosition.y) / distance) *
        planetVelocity.y +
      planetVelocity.y,
  };

  // Calculer l'angle et la vitesse du projectile
  let angle = Math.atan2(projectileVelocity.y, projectileVelocity.x);
  let speed = Math.sqrt(
    Math.pow(projectileVelocity.x, 2) + Math.pow(projectileVelocity.y, 2)
  );

  // Retourner l'angle et la vitesse du projectile
  return {
    angle: angle,
    speed: speed,
  };
}

// Cette fonction calcule l'angle et la vitesse nécessaires pour intercepter une cible en mouvement.
// La fonction prend les paramètres suivants :
// ciblePosition - la position actuelle de la cible
// cibleVitesse - la vitesse actuelle de la cible
// projectilePosition - la position actuelle du projectile
// projectileVitesse - la vitesse initiale et constante du projectile
// temps - le temps en secondes auquel le projectile doit intercepter la cible

function calculateInterception(
  ciblePosition,
  cibleVitesse,
  projectilePosition,
  projectileVitesse,
  temps
) {
  // Calculer la position future de la cible
  let cibleFuturePosition = {
    x: ciblePosition.x + cibleVitesse.x * temps,
    y: ciblePosition.y + cibleVitesse.y * temps,
  };

  // Calculer la distance entre le projectile et la cible future
  let distance = Math.sqrt(
    Math.pow(cibleFuturePosition.x - projectilePosition.x, 2) +
      Math.pow(cibleFuturePosition.y - projectilePosition.y, 2)
  );

  // Calculer l'angle
  let angle = Math.atan2(
    cibleFuturePosition.y - projectilePosition.y,
    cibleFuturePosition.x - projectilePosition.x
  );

  // Calculer la vitesse
  let vitesse = distance / temps;

  // Retourne l'angle et la vitesse
  return { angle: angle, vitesse: vitesse };
}

function interceptPlanet(planet, projectile) {
  // Calculer la distance entre la planète et le projectile
  let distance = Math.sqrt(
    Math.pow(planet.x - projectile.x, 2) + Math.pow(planet.y - projectile.y, 2)
  );

  // Calculer le temps nécessaire pour atteindre la planète
  let time = distance / projectile.speed;

  // Calculer la nouvelle position de la planète après le temps écoulé
  let newPlanetX = planet.x + planet.speed * time * Math.cos(planet.angle);
  let newPlanetY = planet.y + planet.speed * time * Math.sin(planet.angle);

  // Calculer l'angle et la vitesse nécessaires pour atteindre la planète
  let angle = Math.atan2(newPlanetY - projectile.y, newPlanetX - projectile.x);
  let speed = distance / time;

  return {
    angle: angle,
    speed: speed,
  };
}
