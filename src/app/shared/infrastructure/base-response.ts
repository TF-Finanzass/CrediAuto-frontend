/**
 * Abstract interface for API response structures in the infrastructure layer.
 */
export interface BaseResponse {}

/**
 * Defines a standard structure for API resources with a unique identifier in the infrastructure layer.
 */
export interface BaseResource {
  /**
   * The unique identifier for the resource.
   */
  id: number;
}
