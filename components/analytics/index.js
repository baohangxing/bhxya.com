import GA from './GoogleAnalytics'
import Plausible from './Plausible'
import SimpleAnalytics from './SimpleAnalytics'
import siteMetadata from '@/data/siteMetadata'
import BA from './BaiduAnalytics'

const isProduction = process.env.NODE_ENV === 'production'

const Analytics = () => {
  return (
    <>
      {isProduction && siteMetadata.analytics.plausibleDataDomain && <Plausible />}
      {isProduction && siteMetadata.analytics.simpleAnalytics && <SimpleAnalytics />}
      {isProduction && siteMetadata.analytics.googleAnalyticsId && <GA />}
      {isProduction && siteMetadata.analytics.baiduAnalyticsId && <BA />}
    </>
  )
}

export default Analytics
