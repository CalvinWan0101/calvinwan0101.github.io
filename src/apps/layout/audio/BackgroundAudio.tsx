import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FiMusic, FiVolumeX } from 'react-icons/fi'
import backgroundTrack from '../../../assets/background.mp3'

const AUDIO_PREFERENCE_KEY = 'background-audio-enabled'

const backgroundAudio = new Audio(backgroundTrack)
backgroundAudio.loop = true
backgroundAudio.preload = 'auto'
backgroundAudio.volume = 0.45

const getStoredPreference = () => {
  if (typeof window === 'undefined') {
    return true
  }

  const storedValue = window.localStorage.getItem(AUDIO_PREFERENCE_KEY)
  return storedValue === null ? true : storedValue === 'true'
}

export const BackgroundAudio = () => {
  const [isEnabled, setIsEnabled] = useState(getStoredPreference)
  const [isBlocked, setIsBlocked] = useState(false)

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

        if (!isDisposed) {
          setIsBlocked(false)
        }
      } catch {
        if (!isDisposed) {
          setIsBlocked(true)
        }
      }
    }

    const resumePlayback = () => {
      if (!backgroundAudio.paused) {
        setIsBlocked(false)
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
      <Hint $isVisible={isEnabled && isBlocked}>瀏覽器擋住自動播放，點一下頁面就會開始。</Hint>
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

const Hint = styled.p<{ $isVisible: boolean }>`
  position: absolute;
  right: 0;
  bottom: calc(100% + 0.5rem);
  margin: 0;
  width: max-content;
  max-width: min(28rem, calc(100vw - 2rem));
  border: 1px solid var(--border-soft);
  padding: 0.7rem 0.85rem;
  background: rgba(253, 252, 248, 0.96);
  color: var(--text-muted);
  box-shadow: var(--shadow);
  font-size: 0.8rem;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transform: translateY(${({ $isVisible }) => ($isVisible ? '0' : '0.35rem')});
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  transition:
    opacity 0.28s ease,
    transform 0.28s ease,
    visibility 0.28s ease;
  pointer-events: none;

  @media (max-width: 720px) {
    max-width: calc(100vw - 2rem);
    font-size: 0.75rem;
    line-height: 1.35;
  }
`