export enum SceneStates{
    Boot = 'BootScene',
    Title = 'TitleScene',
    Game = 'GameScene',
    GameOver = 'GameOverScene'
}

export var GameValues = {
    allowSound: true,
    initialGameVolume: 0.05,
}

export enum MyAudio{
    // Music
    MusicTitle = 'music_title',
    MusicGame = 'music_game',
    MusicGameOver = 'music_game_over',

    // Sound Effects
    Jump = 'audio_jump',
    Hit = 'audio_hit',
    Death = 'audio_death',
    BallBounce = 'audio_ball_bounce',
    Score = 'audio_score',
    Landed = 'audio_landed',
}