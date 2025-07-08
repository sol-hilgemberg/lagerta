import pygame

# Inicializa el mixer de sonido
pygame.mixer.init()

# Carga el archivo de sonido (puede ser .wav o .mp3)
pygame.mixer.music.load("sonido.mp3")  # o sonido.wav
pygame.mixer.music.play()

# Espera a que termine
while pygame.mixer.music.get_busy():
    pygame.time.Clock().tick(10)
