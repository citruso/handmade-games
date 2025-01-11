import pygame

pygame.init()

WIDTH = 800
HEIGHT = 600

screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()
FPS = 60

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)

class Player(pygame.sprite.Sprite):
    def __init__(self):
        self.image = pygame.Surface((32, 32))
        self.image.fill(WHITE)
        self.rect = self.image.get_rect()  # Get rect of some size as 'image'.
        self.velocity = [0, 0]

    def update(self):
        self.rect.move_ip(*self.velocity)

        if self.rect.right > WIDTH:
            self.rect.right = WIDTH
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.bottom > HEIGHT:
            self.rect.bottom = HEIGHT
        if self.rect.top < 0:
            self.rect.top = 0

player = Player()
keyup = False
running = True

while running:
    dt = clock.tick(FPS) / 10 # Returns milliseconds between each call to 'tick'. The convert time to seconds.
    screen.fill(BLACK)  # Fill the screen with background color.
    
    if keyup:
        if player.velocity[0] > 0:
            player.velocity[0] -= 1
        if player.velocity[0] < 0:
            player.velocity[0] += 1
        if player.velocity[1] > 0:
            player.velocity[1] -= 1
        if player.velocity[1] < 0:
            player.velocity[1] += 1
        
    for event in pygame.event.get():
        if event.type == pygame.KEYDOWN:
            if event.key in (pygame.K_w, pygame.K_UP):
                player.velocity[1] = -20
            if event.key in (pygame.K_s, pygame.K_DOWN):
                player.velocity[1] = 20
            if event.key in (pygame.K_a, pygame.K_LEFT):
                player.velocity[0] = -20
            if event.key in (pygame.K_d, pygame.K_RIGHT):
                player.velocity[0] = 20

            if event.key == pygame.K_ESCAPE:
                running = False
                pygame.quit()
        elif event.type == pygame.KEYUP:
            keyup = True

    if running:
        player.update()

        screen.blit(player.image, player.rect)
        pygame.display.update()  # Or pygame.display.flip()
