import React from 'react'
import Button from '@santiment-network/ui/Button'
import { setupColorGenerator } from './utils'
import { getDateFormats, getTimeFormats } from '../../utils/dates'
import colors from '@santiment-network/ui/variables.scss'

function setStyle (target, styles) {
  target.setAttribute('style', styles)
}

const HIDDEN_STYLES = `
position: absolute;
left: 200vw;`

const SVG_STYLES = `
    --porcelain: ${colors.porcelain};
    --mystic: ${colors.mystic};
    --malibu: ${colors.malibu};
    --heliotrope: ${colors.heliotrope};
    --persimmon: ${colors.persimmon};
    --white: white;
    --texas-rose: ${colors['texas-rose']};
    --jungle-green: ${colors['jungle-green']};
    --lima: ${colors.lima};
    --dodger-blue: ${colors['dodger-blue']};
    --waterloo: ${colors.waterloo};
    background: white;
  `

const TEXT_STYLES = `
fill: #9faac4;
font-family: Rubik, sans-serif;
font-weight: 400;
font-size: 12px;
line-height: 18px;
`

const AXIS_STYLES = `
stroke: var(--porcelain);
stroke-dasharray: 7;
`

const TICK_STYLES = 'display: none'

const LEGEND_RECT_SIZE = 5
const LEGEND_RECT_RIGHT_MARGIN = 5
const LEGEND_RECT_ALIGN_CORRECTION = LEGEND_RECT_SIZE / 5
const TEXT_RIGHT_MARGIN = 20
const TEXT_FONT = '12px Rubik'

function drawAndMeasureText (ctx, text, x, y) {
  ctx.fillText(text, x, y)
  return ctx.measureText(text).width
}

const addWatermark = svg => {
  const newElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  ) // Create a path in SVG's namespace
  newElement.setAttribute(
    'd',
    'M6 33.063c0-.471.128-.825.386-1.062.257-.236.604-.353 1.043-.353.438 0 .785.118 1.043.353.257.237.385.59.385 1.062 0 .49-.128.852-.385 1.088-.258.235-.605.354-1.043.354-.439 0-.786-.119-1.043-.354-.258-.236-.386-.598-.386-1.088zM10.913 37.382c.38.223.83.413 1.353.571a5.539 5.539 0 0 0 1.61.237c.626 0 1.158-.154 1.594-.462.437-.309.656-.808.656-1.5 0-.578-.134-1.054-.399-1.428a4.464 4.464 0 0 0-1.011-1.008c-.409-.299-.85-.574-1.325-.824a7.063 7.063 0 0 1-1.325-.901 4.512 4.512 0 0 1-1.011-1.25c-.266-.48-.399-1.091-.399-1.832 0-1.184.327-2.076.983-2.678.655-.602 1.581-.903 2.777-.903.779 0 1.453.07 2.023.21.57.138 1.063.33 1.481.57l-.54 1.671a5.96 5.96 0 0 0-1.254-.46 5.892 5.892 0 0 0-1.453-.18c-.684 0-1.182.139-1.496.418-.313.278-.47.715-.47 1.309 0 .465.133.859.399 1.184.266.325.603.622 1.01.891.41.27.85.543 1.326.822.474.279.916.608 1.325.989.408.38.745.835 1.01 1.364.267.53.4 1.194.4 1.992 0 .52-.086 1.012-.257 1.476-.17.465-.432.869-.783 1.212a3.85 3.85 0 0 1-1.31.822c-.523.204-1.136.306-1.838.306-.836 0-1.558-.079-2.165-.237-.608-.157-1.121-.366-1.539-.626l.628-1.755zM20.628 26.574c.55-.334 1.22-.594 2.009-.78a10.842 10.842 0 0 1 2.492-.278c.797 0 1.438.116 1.923.348.485.232.864.548 1.14.946.275.4.456.855.54 1.365.087.511.129 1.045.129 1.601 0 1.115-.025 2.2-.073 3.26a64.898 64.898 0 0 0-.073 3.007c0 .706.023 1.361.073 1.964.049.603.14 1.174.273 1.713h-1.606l-.498-1.643h-.113c-.283.483-.697.9-1.244 1.253-.546.353-1.282.53-2.206.53-1.018 0-1.852-.349-2.503-1.045-.65-.697-.975-1.658-.975-2.883 0-.799.136-1.468.41-2.006.273-.538.66-.974 1.159-1.31.499-.333 1.092-.57 1.78-.71.687-.139 1.455-.209 2.302-.209h.565c.188 0 .386.01.594.028a15.9 15.9 0 0 0 .085-1.532c0-1.059-.16-1.801-.48-2.229-.32-.427-.904-.64-1.75-.64-.527 0-1.1.079-1.722.237-.621.157-1.138.358-1.553.598l-.678-1.585zm6.125 6.742a11.456 11.456 0 0 0-1.126-.056c-.45 0-.891.037-1.323.11a3.67 3.67 0 0 0-1.154.39 2.147 2.147 0 0 0-.803.753c-.197.316-.295.715-.295 1.197 0 .743.183 1.319.549 1.727.366.409.84.613 1.42.613.789 0 1.399-.185 1.83-.557.432-.37.732-.78.9-1.225v-2.952h.002zM39.457 39.666V31.17c0-1.392-.166-2.4-.498-3.022-.333-.622-.927-.933-1.781-.933-.76 0-1.387.223-1.88.67a3.921 3.921 0 0 0-1.083 1.643v10.14h-2.05v-13.93h1.48l.37 1.477h.086c.361-.502.85-.928 1.467-1.282.618-.352 1.354-.529 2.209-.529.607 0 1.143.084 1.609.251.465.167.854.45 1.168.85.313.399.55.933.713 1.601.161.669.242 1.514.242 2.535v9.025h-2.052zM43.246 25.738h1.738V22.98l2.051-.641v3.399h3.076v1.81h-3.076v8.301c0 .817.1 1.407.3 1.768.199.362.527.543.982.543.38 0 .707-.041.983-.125.274-.084.574-.19.897-.32l.399 1.588a6.774 6.774 0 0 1-2.963.669c-.95 0-1.628-.303-2.036-.906-.409-.603-.613-1.583-.613-2.939v-8.58h-1.738v-1.81zM52.477 21.504c0-.445.127-.807.384-1.086S53.455 20 53.873 20c.418 0 .764.135 1.04.404.275.27.413.636.413 1.1 0 .446-.139.794-.413 1.045-.276.25-.622.376-1.04.376-.418 0-.755-.13-1.011-.39-.257-.26-.385-.603-.385-1.03zm.37 4.234h2.051v13.928h-2.05V25.738zM65.352 39.666v-8.273c0-.742-.024-1.379-.071-1.908-.048-.53-.148-.961-.3-1.296-.152-.334-.36-.58-.626-.738-.267-.157-.618-.236-1.055-.236-.645 0-1.192.246-1.637.737a4.062 4.062 0 0 0-.926 1.686v10.027h-2.052V25.738h1.453l.37 1.477h.086a4.989 4.989 0 0 1 1.425-1.31c.55-.334 1.253-.502 2.108-.502.72 0 1.314.153 1.78.46.466.306.831.85 1.097 1.63a3.78 3.78 0 0 1 1.467-1.533 4.078 4.078 0 0 1 2.094-.557c.627 0 1.163.08 1.61.237.446.158.806.437 1.082.836.275.4.48.929.612 1.587.133.66.2 1.49.2 2.494v9.108h-2.051v-8.857c0-1.207-.12-2.107-.356-2.702-.237-.594-.783-.892-1.638-.892-.722 0-1.296.219-1.723.655-.428.437-.727 1.026-.898 1.769v10.027h-2.05v.001zM85.75 38.719c-.456.408-1.036.724-1.738.946A7.306 7.306 0 0 1 81.79 40c-.893 0-1.666-.171-2.322-.515a4.367 4.367 0 0 1-1.623-1.476c-.428-.64-.74-1.407-.94-2.298-.2-.892-.3-1.895-.3-3.008 0-2.377.447-4.188 1.34-5.432.893-1.245 2.155-1.867 3.789-1.867.53 0 1.058.066 1.581.195.522.13.992.39 1.41.78.418.39.755.938 1.011 1.643.257.706.385 1.626.385 2.758 0 .317-.015.655-.043 1.017-.029.362-.062.738-.1 1.129h-7.236c0 .798.066 1.523.2 2.173.132.65.341 1.202.626 1.657.285.455.65.808 1.097 1.059.447.25 1.002.376 1.667.376.513 0 1.02-.093 1.524-.28.503-.185.887-.408 1.154-.668l.74 1.477zm-1.595-7.465c.038-1.393-.162-2.414-.599-3.064-.436-.65-1.035-.975-1.794-.975-.874 0-1.567.326-2.08.975-.513.65-.816 1.671-.911 3.064h5.384zM96.29 39.666V31.17c0-1.392-.167-2.4-.5-3.022-.332-.622-.926-.933-1.78-.933-.76 0-1.387.223-1.88.67a3.922 3.922 0 0 0-1.083 1.643v10.14h-2.05v-13.93h1.48l.37 1.477h.086c.361-.502.85-.928 1.467-1.282.618-.352 1.354-.529 2.208-.529.608 0 1.144.084 1.61.251.465.167.854.45 1.167.85.313.399.55.933.712 1.601.162.669.243 1.514.243 2.535v9.025h-2.05zM100.078 25.738h1.738V22.98l2.051-.641v3.399h3.076v1.81h-3.076v8.301c0 .817.099 1.407.299 1.768.2.362.527.543.983.543.38 0 .707-.041.983-.125.274-.084.574-.19.897-.32l.399 1.588a6.785 6.785 0 0 1-2.963.669c-.95 0-1.628-.303-2.037-.906-.408-.603-.612-1.583-.612-2.939v-8.58h-1.738v-1.81zM108.857 32.845c0-.472.129-.826.386-1.062.257-.236.605-.354 1.043-.354.438 0 .786.118 1.043.354.257.236.386.59.386 1.062 0 .489-.129.851-.386 1.087-.257.235-.605.354-1.043.354-.438 0-.786-.119-1.043-.354-.257-.236-.386-.598-.386-1.087zM28.679 15a.353.353 0 0 1-.238-.084.353.353 0 0 1-.084-.238V5.536c0-.103.028-.182.084-.238a.324.324 0 0 1 .238-.098h3.178c1.409 0 2.426.317 3.052.952.625.625.952 1.573.98 2.842.009.27.014.635.014 1.092 0 .457-.005.826-.014 1.106-.028.887-.178 1.61-.448 2.17a2.54 2.54 0 0 1-1.246 1.232c-.57.27-1.326.406-2.268.406h-3.248zm3.178-1.19c.644 0 1.152-.089 1.526-.266.382-.177.658-.457.826-.84.177-.392.275-.915.294-1.568.018-.56.028-.91.028-1.05 0-.15-.01-.495-.028-1.036-.019-.924-.238-1.596-.658-2.016-.42-.43-1.106-.644-2.058-.644h-2.058v7.42h2.128zm8 1.33c-.457 0-.882-.093-1.274-.28a2.44 2.44 0 0 1-.938-.756 1.866 1.866 0 0 1-.336-1.078c0-.616.252-1.12.756-1.512.513-.401 1.204-.663 2.072-.784l2.086-.294v-.406c0-.952-.546-1.428-1.638-1.428-.41 0-.747.089-1.008.266a1.72 1.72 0 0 0-.588.602.38.38 0 0 1-.112.182c-.037.037-.093.056-.168.056h-.602a.334.334 0 0 1-.224-.084.334.334 0 0 1-.084-.224c.01-.224.112-.476.308-.756.205-.29.518-.537.938-.742.42-.215.938-.322 1.554-.322 1.045 0 1.797.247 2.254.742.457.485.686 1.092.686 1.82v4.536a.324.324 0 0 1-.098.238.303.303 0 0 1-.224.084h-.644a.353.353 0 0 1-.238-.084.353.353 0 0 1-.084-.238v-.602c-.205.299-.504.55-.896.756-.392.205-.891.308-1.498.308zm.294-1.05c.607 0 1.101-.196 1.484-.588.392-.401.588-.975.588-1.722v-.392l-1.624.238c-.663.093-1.162.252-1.498.476-.336.215-.504.49-.504.826 0 .373.154.663.462.868.308.196.672.294 1.092.294zm8.174.91c-1.474 0-2.212-.821-2.212-2.464V8.84h-1.092a.353.353 0 0 1-.238-.084.353.353 0 0 1-.084-.238v-.476c0-.093.028-.168.084-.224a.324.324 0 0 1 .238-.098h1.092V5.382c0-.093.028-.168.084-.224a.324.324 0 0 1 .238-.098h.658a.28.28 0 0 1 .224.098.28.28 0 0 1 .098.224V7.72h1.736a.28.28 0 0 1 .224.098.28.28 0 0 1 .098.224v.476a.324.324 0 0 1-.098.238.303.303 0 0 1-.224.084h-1.736v3.598c0 .467.08.821.238 1.064.159.233.42.35.784.35h.854a.28.28 0 0 1 .224.098.28.28 0 0 1 .098.224v.504a.324.324 0 0 1-.098.238.303.303 0 0 1-.224.084h-.966zm4.657.14c-.457 0-.882-.093-1.274-.28a2.44 2.44 0 0 1-.938-.756 1.866 1.866 0 0 1-.336-1.078c0-.616.252-1.12.756-1.512.513-.401 1.204-.663 2.072-.784l2.086-.294v-.406c0-.952-.546-1.428-1.638-1.428-.41 0-.747.089-1.008.266a1.72 1.72 0 0 0-.588.602.38.38 0 0 1-.112.182c-.037.037-.093.056-.168.056h-.602a.334.334 0 0 1-.224-.084.334.334 0 0 1-.084-.224c.01-.224.112-.476.308-.756.205-.29.518-.537.938-.742.42-.215.938-.322 1.554-.322 1.045 0 1.797.247 2.254.742.457.485.686 1.092.686 1.82v4.536a.324.324 0 0 1-.098.238.303.303 0 0 1-.224.084h-.644a.353.353 0 0 1-.238-.084.353.353 0 0 1-.084-.238v-.602c-.205.299-.504.55-.896.756-.392.205-.891.308-1.498.308zm.294-1.05c.607 0 1.101-.196 1.484-.588.392-.401.588-.975.588-1.722v-.392l-1.624.238c-.663.093-1.162.252-1.498.476-.336.215-.504.49-.504.826 0 .373.154.663.462.868.308.196.672.294 1.092.294zm9.622.91a.353.353 0 0 1-.238-.084.353.353 0 0 1-.083-.238V8.84h-1.19a.353.353 0 0 1-.239-.084.353.353 0 0 1-.084-.238v-.476c0-.093.029-.168.084-.224a.324.324 0 0 1 .238-.098h1.19v-.7c0-1.587.803-2.38 2.408-2.38h.84a.28.28 0 0 1 .225.098.28.28 0 0 1 .097.224v.476a.324.324 0 0 1-.097.238.303.303 0 0 1-.225.084h-.811c-.42 0-.715.112-.883.336-.167.215-.251.546-.251.994v.63h1.806a.28.28 0 0 1 .224.098.28.28 0 0 1 .097.224v.476a.324.324 0 0 1-.097.238.303.303 0 0 1-.225.084H63.88v5.838a.324.324 0 0 1-.098.238.303.303 0 0 1-.224.084h-.659zm4.66 0a.353.353 0 0 1-.239-.084.353.353 0 0 1-.084-.238V8.056c0-.093.028-.173.084-.238a.324.324 0 0 1 .238-.098h.644c.094 0 .173.033.238.098a.324.324 0 0 1 .098.238v.616c.383-.635 1.036-.952 1.96-.952h.546a.28.28 0 0 1 .224.098.28.28 0 0 1 .098.224v.574a.28.28 0 0 1-.098.224.303.303 0 0 1-.224.084h-.84c-.504 0-.9.15-1.19.448-.29.29-.434.686-.434 1.19v4.116a.324.324 0 0 1-.098.238.353.353 0 0 1-.238.084h-.686zm7.84.14c-1.026 0-1.824-.29-2.393-.868-.56-.579-.859-1.349-.896-2.31l-.014-.602.014-.602c.037-.952.34-1.717.91-2.296.57-.588 1.362-.882 2.38-.882 1.017 0 1.81.294 2.38.882.57.579.873 1.344.91 2.296.01.103.014.303.014.602s-.005.5-.014.602c-.037.961-.34 1.731-.91 2.31-.56.579-1.353.868-2.38.868zm0-1.078c.589 0 1.05-.187 1.387-.56.345-.373.532-.91.56-1.61.01-.093.014-.27.014-.532 0-.261-.005-.439-.014-.532-.028-.7-.215-1.237-.56-1.61-.336-.373-.798-.56-1.386-.56-.588 0-1.055.187-1.4.56-.346.373-.527.91-.546 1.61l-.014.532.014.532c.019.7.2 1.237.546 1.61.345.373.812.56 1.4.56zm5.38.938a.353.353 0 0 1-.238-.084.353.353 0 0 1-.084-.238V8.042c0-.093.028-.168.084-.224a.324.324 0 0 1 .238-.098h.63a.28.28 0 0 1 .224.098.28.28 0 0 1 .098.224v.49c.485-.635 1.162-.952 2.03-.952 1.036 0 1.769.43 2.198 1.288.224-.392.541-.705.952-.938.41-.233.873-.35 1.386-.35.765 0 1.39.261 1.876.784.485.523.728 1.279.728 2.268v4.046a.324.324 0 0 1-.098.238.303.303 0 0 1-.224.084h-.658a.353.353 0 0 1-.238-.084.353.353 0 0 1-.084-.238v-3.92c0-.728-.154-1.25-.462-1.568-.299-.317-.695-.476-1.19-.476-.439 0-.817.163-1.134.49-.317.317-.476.835-.476 1.554v3.92a.324.324 0 0 1-.098.238.303.303 0 0 1-.224.084h-.658a.353.353 0 0 1-.238-.084.353.353 0 0 1-.084-.238v-3.92c0-.728-.159-1.25-.476-1.568-.308-.317-.7-.476-1.176-.476-.439 0-.817.163-1.134.49-.317.317-.476.83-.476 1.54v3.934a.324.324 0 0 1-.098.238.303.303 0 0 1-.224.084h-.672z'
  ) // Set path's data
  newElement.style.fill = '#D2D6E7'
  newElement.style.transform = 'translate(89%,2%)'

  svg.appendChild(newElement)

  return svg
}

function downloadChart ({ current: chart }, metrics, title) {
  const div = document.createElement('div')
  setStyle(div, HIDDEN_STYLES)

  const svg = addWatermark(
    chart.querySelector('.recharts-surface').cloneNode(true)
  )

  div.appendChild(svg)
  document.body.appendChild(div)
  setStyle(svg, SVG_STYLES)

  const texts = svg.querySelectorAll('text')
  texts.forEach(text => setStyle(text, TEXT_STYLES))

  const axes = svg.querySelectorAll('.recharts-cartesian-axis-line')
  axes.forEach(axis => setStyle(axis, AXIS_STYLES))

  const axisTicks = svg.querySelectorAll('.recharts-cartesian-axis-tick-line')
  axisTicks.forEach(tick => setStyle(tick, TICK_STYLES))

  const brush = svg.querySelector('.recharts-brush')
  brush.style.display = 'none'

  const canvas = document.createElement('canvas')
  div.appendChild(canvas)

  const svgSize = svg.getBoundingClientRect()
  canvas.width = svgSize.width * 2
  canvas.height = svgSize.height * 2
  canvas.style.width = svgSize.width
  canvas.style.height = svgSize.height

  const ctx = canvas.getContext('2d')
  ctx.scale(2, 2)

  const svgData = new XMLSerializer().serializeToString(svg)
  const img = document.createElement('img')

  img.onload = function () {
    const generateColor = setupColorGenerator()
    ctx.drawImage(img, 0, 0)

    ctx.font = TEXT_FONT

    const textWidth =
      metrics.reduce((acc, { label }) => {
        return (
          acc +
          LEGEND_RECT_SIZE +
          LEGEND_RECT_RIGHT_MARGIN +
          ctx.measureText(label).width
        )
      }, 0) +
      TEXT_RIGHT_MARGIN * (metrics.length - 1)

    const textY = svgSize.height - 20
    let textX = (svgSize.width - textWidth) / 2

    metrics.forEach(({ color, label }) => {
      ctx.fillStyle = colors[generateColor(color)]
      ctx.fillRect(
        textX,
        textY - LEGEND_RECT_SIZE - LEGEND_RECT_ALIGN_CORRECTION,
        LEGEND_RECT_SIZE,
        LEGEND_RECT_SIZE
      )
      ctx.fillStyle = colors.mirage
      textX += LEGEND_RECT_SIZE + LEGEND_RECT_RIGHT_MARGIN
      textX += drawAndMeasureText(ctx, label, textX, textY) + TEXT_RIGHT_MARGIN
    })

    const date = new Date()
    const { DD, MMM, YYYY } = getDateFormats(date)
    const { HH, mm, ss } = getTimeFormats(date)
    const a = document.createElement('a')
    a.download = `${title} [${HH}.${mm}.${ss}, ${DD} ${MMM}, ${YYYY}].png`
    a.href = canvas.toDataURL('image/png', 1)

    div.appendChild(a)
    a.click()

    div.remove()
  }

  img.setAttribute(
    'src',
    'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  )
}

const ChartDownloadBtn = ({ chartRef, metrics, title, ...props }) => {
  return (
    <Button
      {...props}
      onClick={() => {
        try {
          downloadChart(chartRef, metrics, title)
        } catch (e) {
          alert("Can't download this chart")
        }
      }}
    />
  )
}

export default ChartDownloadBtn
