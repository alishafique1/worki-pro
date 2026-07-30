import { createQuery } from '../../middleware/operations.js'
import getCreditBalance from '../../queries/getCreditBalance.js'

export default createQuery(getCreditBalance)
