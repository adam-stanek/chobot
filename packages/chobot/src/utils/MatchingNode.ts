export interface MatchingNode {
  /** Fixed string part of an matching sequence. */
  s?: string

  /** Matcher parameter */
  p?: string

  /** Optional matching sequence */
  o?: MatchingNode[]
}
