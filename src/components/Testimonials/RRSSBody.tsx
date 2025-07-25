import { LinkBox } from './LinkBox'
import { PropertyBox } from './PropertyBox'
import { RichText } from '@/components/richText'

interface Testimonial {
  id: string
  type: 'Impreso' | 'digital' | 'rrss'
  medium: string
  reach: number
  sentiment: 'positive' | 'negative'
  dateOfNote: string // O Date si lo conviertes
  theme: string | Theme // Puede ser el ID o el objeto Theme completo
  title: string
  images: ImageField[]
  section?: string
  originalLink?: string // Nota: el campo en Payload es 'original link' pero en TS usamos camelCase
  spokesperson?: string
  media?: string
  journalist?: string
  extract?: string
  insights?: unknown // O cualquier tipo que uses para richText en el frontend
  subtitle?: string
  client?: string
  likes?: number
  comments?: number
  shares?: number
  createdAt?: string // Agregado por Payload automáticamente
  updatedAt?: string // Agregado por Payload automáticamente
}
interface ImageField {
  image: string | Media // Puede ser el ID o el objeto Media completo
}

interface Theme {
  id: string
  name?: string
  // Agrega otros campos de tu colección 'themes' si es necesario
}
interface Media {
  id: string
  alt?: string
  url?: string
  filename?: string
  mimeType?: string
  width?: number
  height?: number
  sizes?: {
    thumbnail?: {
      url?: string
      width?: number
      height?: number
    }
    // Agrega otros tamaños si los tienes configurados
  }
}
function RRSSBody({ testimonial }: Testimonial) {
  const {
    originalLink,
    reach,
    sentiment,
    mention,
    dateOfNote,
    journalist,
    spokesperson,
    extract,
    insights,
    images,
    likes,
    comments,
    shares,
  } = testimonial
  //  const [props1, setProps1] = useState({})
  //setProps1({ reach, sentiment, mention })
  return (
    <div className="testimonial-digital-body">
      <div className="testimonial-digital-body-container">
        <div className="testimonial-digital-side-bar">
          <div className="property-box centered-box">
            <h3 className="link-title">Link</h3>
            <LinkBox link={originalLink} />
          </div>
          <PropertyBox properties={{ dateOfNote }} />
          {journalist && spokesperson ? (
            <PropertyBox properties={{ journalist, spokesperson }} />
          ) : (
            ''
          )}
          <div className="property-box centered-box">
            <h3 className="link-title">Resumen</h3>
            <p className="extract-paragraph">{extract}</p>
          </div>
          <div className="property-box centered-box">
            <h3 className="link-title">Insights</h3>
            <RichText data={insights} />
          </div>
        </div>
        <div className="testimonial-RRSS-main">
          <div className="testimonial-RRSS-two-cols">
            <PropertyBox properties={{ reach, sentiment, mention }} />
            <PropertyBox properties={{ likes, comments, shares }} />
          </div>
          <div className="testimonial-digital-main">
            {images.map((image) => (
              <img src={image.image.url} alt={image.image.alt} key={image.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { RRSSBody }
