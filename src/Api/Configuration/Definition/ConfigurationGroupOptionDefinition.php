<?php declare(strict_types=1);

namespace Shopware\Api\Configuration\Definition;

use Shopware\Api\Configuration\Collection\ConfigurationGroupOptionBasicCollection;
use Shopware\Api\Configuration\Collection\ConfigurationGroupOptionDetailCollection;
use Shopware\Api\Configuration\Event\ConfigurationGroupOption\ConfigurationGroupOptionDeletedEvent;
use Shopware\Api\Configuration\Event\ConfigurationGroupOption\ConfigurationGroupOptionWrittenEvent;
use Shopware\Api\Configuration\Repository\ConfigurationGroupOptionRepository;
use Shopware\Api\Configuration\Struct\ConfigurationGroupOptionBasicStruct;
use Shopware\Api\Configuration\Struct\ConfigurationGroupOptionDetailStruct;
use Shopware\Api\Entity\EntityDefinition;
use Shopware\Api\Entity\EntityExtensionInterface;
use Shopware\Api\Entity\Field\FkField;
use Shopware\Api\Entity\Field\IdField;
use Shopware\Api\Entity\Field\ManyToManyAssociationField;
use Shopware\Api\Entity\Field\ManyToOneAssociationField;
use Shopware\Api\Entity\Field\OneToManyAssociationField;
use Shopware\Api\Entity\Field\ReferenceVersionField;
use Shopware\Api\Entity\Field\StringField;
use Shopware\Api\Entity\Field\TranslatedField;
use Shopware\Api\Entity\Field\TranslationsAssociationField;
use Shopware\Api\Entity\Field\VersionField;
use Shopware\Api\Entity\FieldCollection;
use Shopware\Api\Entity\Write\Flag\CascadeDelete;
use Shopware\Api\Entity\Write\Flag\PrimaryKey;
use Shopware\Api\Entity\Write\Flag\Required;
use Shopware\Api\Entity\Write\Flag\WriteOnly;
use Shopware\Api\Product\Definition\ProductConfiguratorDefinition;
use Shopware\Api\Product\Definition\ProductDatasheetDefinition;
use Shopware\Api\Product\Definition\ProductDefinition;
use Shopware\Api\Product\Definition\ProductServiceDefinition;
use Shopware\Api\Product\Definition\ProductVariationDefinition;

class ConfigurationGroupOptionDefinition extends EntityDefinition
{
    /**
     * @var FieldCollection
     */
    protected static $primaryKeys;

    /**
     * @var FieldCollection
     */
    protected static $fields;

    /**
     * @var EntityExtensionInterface[]
     */
    protected static $extensions = [];

    public static function getEntityName(): string
    {
        return 'configuration_group_option';
    }

    public static function getFields(): FieldCollection
    {
        if (self::$fields) {
            return self::$fields;
        }

        self::$fields = new FieldCollection([
            (new IdField('id', 'id'))->setFlags(new PrimaryKey(), new Required()),
            new VersionField(),
            (new FkField('configuration_group_id', 'groupId', ConfigurationGroupDefinition::class))->setFlags(new Required()),
            new ReferenceVersionField(ConfigurationGroupDefinition::class),
            (new TranslatedField(new StringField('name', 'name')))->setFlags(new Required()),
            new StringField('color', 'color'),
            new IdField('media_id', 'mediaId'),
            new IdField('media_version_id', 'mediaVersionId'),
            new ManyToOneAssociationField('group', 'configuration_group_id', ConfigurationGroupDefinition::class, true),
            (new TranslationsAssociationField('translations', ConfigurationGroupOptionTranslationDefinition::class, 'configuration_group_option_id', false, 'id'))->setFlags(new Required(), new CascadeDelete()),
            (new OneToManyAssociationField('productConfigurators', ProductConfiguratorDefinition::class, 'configuration_option_id', false, 'id'))->setFlags(new CascadeDelete(), new WriteOnly()),
            (new OneToManyAssociationField('productServices', ProductServiceDefinition::class, 'configuration_option_id', false, 'id'))->setFlags(new CascadeDelete(), new WriteOnly()),
            (new ManyToManyAssociationField('productDatasheets', ProductDefinition::class, ProductDatasheetDefinition::class, false, 'configuration_group_option_id', 'product_id'))->setFlags(new CascadeDelete(), new WriteOnly()),
            (new ManyToManyAssociationField('productVariations', ProductDefinition::class, ProductVariationDefinition::class, false, 'configuration_group_option_id', 'product_id'))->setFlags(new CascadeDelete(), new WriteOnly()),
        ]);

        foreach (self::$extensions as $extension) {
            $extension->extendFields(self::$fields);
        }

        return self::$fields;
    }

    public static function getRepositoryClass(): string
    {
        return ConfigurationGroupOptionRepository::class;
    }

    public static function getBasicCollectionClass(): string
    {
        return ConfigurationGroupOptionBasicCollection::class;
    }

    public static function getDeletedEventClass(): string
    {
        return ConfigurationGroupOptionDeletedEvent::class;
    }

    public static function getWrittenEventClass(): string
    {
        return ConfigurationGroupOptionWrittenEvent::class;
    }

    public static function getBasicStructClass(): string
    {
        return ConfigurationGroupOptionBasicStruct::class;
    }

    public static function getTranslationDefinitionClass(): ?string
    {
        return ConfigurationGroupOptionTranslationDefinition::class;
    }

    public static function getDetailStructClass(): string
    {
        return ConfigurationGroupOptionDetailStruct::class;
    }

    public static function getDetailCollectionClass(): string
    {
        return ConfigurationGroupOptionDetailCollection::class;
    }
}
