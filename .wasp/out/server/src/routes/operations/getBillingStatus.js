import { createQuery } from '../../middleware/operations.js'
import getBillingStatus from '../../queries/getBillingStatus.js'

export default createQuery(getBillingStatus)
