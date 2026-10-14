import { useEffect, useRef } from 'react'
import './AdBanner.css'

/**
 * Google AdSense ad unit component.
 *
 * Usage:
 *   <AdBanner slot="XXXXXXXXXX" format="auto" />
 *   <AdBanner slot="XXXXXXXXXX" format="rectangle" />
 *   <AdBanner slot="XXXXXXXXXX" format="horizontal" label="Advertisement" />
 *
 * Replace the `slot` prop with your real ad unit IDs from AdSense dashboard.
 * Until your account is approved and ad units are created, the space will be blank.
 */
export default function AdBanner({
  slot = '0000000000',
  format = 'auto',
  responsive = true,
  label = 'Advertisement',
  className = '',
}) {
  const adRef = useRef(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    try {
      const adsbygoogle = window.adsbygoogle || []
      adsbygoogle.push({})
      pushed.current = true
    } catch (e) {
      // AdSense not loaded (e.g. ad blocker) — fail silently
    }
  }, [])

  return (
    <div className={`ad-banner ad-banner--${format} ${className}`} aria-label={label} role="complementary">
      <p className="ad-banner__label" aria-hidden="true">{label}</p>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8524342512530797"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}
