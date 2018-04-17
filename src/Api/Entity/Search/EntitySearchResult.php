<?php declare(strict_types=1);

namespace Shopware\Api\Entity\Search;

use Shopware\Api\Entity\EntityCollection;
use Shopware\Context\Struct\ShopContext;

class EntitySearchResult
{
    /**
     * @var int
     */
    protected $total;

    /**
     * @var EntityCollection
     */
    protected $entities;

    /**
     * @var AggregatorResult
     */
    protected $aggregations;

    /**
     * @var Criteria
     */
    protected $criteria;

    /**
     * @var ShopContext
     */
    protected $context;

    public function __construct(
        int $total,
        EntityCollection $entities,
        AggregatorResult $aggregations,
        Criteria $criteria,
        ShopContext $context
    ) {
        $this->total = $total;
        $this->entities = $entities;
        $this->aggregations = $aggregations;
        $this->criteria = $criteria;
        $this->context = $context;
    }
}