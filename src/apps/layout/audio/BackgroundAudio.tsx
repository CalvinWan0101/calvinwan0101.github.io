import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FiMusic, FiVolumeX } from 'react-icons/fi'
import backgroundTrack from '../../../assets/background.mp3'

const AUDIO_PREFERENCE_KEY = 'background-audio-enabled-v2'
const LEGACY_AUDIO_PREFERENCE_KEY = 'background-audio-enabled'

const backgroundAudio = new Audio(backgroundTrack)
backgroundAudio.loop = true
backgroundAudio.preload = 'auto'
backgroundAudio.volume = 0.45

const getStoredPreference = () => {
  if (typeof window === 'undefined') {
    return false
  }

  const storedValue = window.localStorage.getItem(AUDIO_PREFERENCE_KEY)

  if (storedValue === null) {
    window.localStorage.removeItem(LEGACY_AUDIO_PREFERENCE_KEY)
  }

  return storedValue === null ? false : storedValue === 'true'
}

export const BackgroundAudio = () => {
  const [isEnabled, setIsEnabled] = useState(getStoredPreference)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(AUDIO_PREFERENCE_KEY, String(isEnabled))
  }, [isEnabled])

  useEffect(() => {
    if (!isEnabled) {
      backgroundAudio.pause()
      return
    }

    let isDisposed = false

    const tryPlay = async () => {
      try {
        await backgroundAudio.play()
      } catch {
        if (isDisposed) {
          return
        }
      }
    }

    const resumePlayback = () => {
      if (!backgroundAudio.paused) {
        return
      }

      void tryPlay()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resumePlayback()
      }
    }

    void tryPlay()

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pointerdown', resumePlayback)
    window.addEventListener('keydown', resumePlayback)

    return () => {
      isDisposed = true
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pointerdown', resumePlayback)
      window.removeEventListener('keydown', resumePlayback)
    }
  }, [isEnabled])

  const handleToggle = () => {
    setIsEnabled((currentState) => !currentState)
  }

  const buttonLabel = isEnabled ? '暫停背景音樂' : '播放背景音樂'

  return (
    <AudioDock>
      <AudioButton
        type="button"
        onClick={handleToggle}
        $isEnabled={isEnabled}
        aria-label={buttonLabel}
        title={buttonLabel}
      >
        {isEnabled ? <FiMusic size={18} /> : <FiVolumeX size={18} />}
      </AudioButton>
    </AudioDock>
  )
}

const AudioDock = styled.div`
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 40;
  display: flex;
  justify-content: end;

  @media (max-width: 720px) {
    right: 1rem;
    bottom: 1rem;
  }
`

const AudioButton = styled.button<{ $isEnabled: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--accent);
  width: 3rem;
  height: 3rem;
  padding: 0;
  background: ${({ $isEnabled }) => ($isEnabled ? 'var(--accent)' : 'rgba(253, 252, 248, 0.94)')};
  color: ${({ $isEnabled }) => ($isEnabled ? '#fff8ef' : 'var(--accent)')};
  box-shadow: var(--shadow);
  font: inherit;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`
