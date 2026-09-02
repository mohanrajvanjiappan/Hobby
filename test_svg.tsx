const SvgDefs = () => (
  <svg width="0" height="0" className="hidden absolute">
    <defs>
      <filter id="pixelate" x="0" y="0">
        <feFlood x="2" y="2" height="2" width="2"/>
        <feComposite width="12" height="12"/>
        <feTile result="a"/>
        <feComposite in="SourceGraphic" in2="a" operator="in"/>
        <feMorphology operator="dilate" radius="6"/>
      </filter>
      <filter id="zoom-blur">
        <feGaussianBlur stdDeviation="8" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.8"/>
        </feComponentTransfer>
      </filter>
    </defs>
  </svg>
)
