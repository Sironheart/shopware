<?php declare(strict_types=1);

namespace Shopware\Locale\Struct;

use Shopware\Framework\Struct\Struct;

class LocaleBasicStruct extends Struct
{
    /**
     * @var string
     */
    protected $uuid;

    /**
     * @var string
     */
    protected $code;

    /**
     * @var string
     */
    protected $language;

    /**
     * @var string
     */
    protected $territory;

    public function getUuid(): string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): void
    {
        $this->uuid = $uuid;
    }

    public function getCode(): string
    {
        return $this->code;
    }

    public function setCode(string $code): void
    {
        $this->code = $code;
    }

    public function getLanguage(): string
    {
        return $this->language;
    }

    public function setLanguage(string $language): void
    {
        $this->language = $language;
    }

    public function getTerritory(): string
    {
        return $this->territory;
    }

    public function setTerritory(string $territory): void
    {
        $this->territory = $territory;
    }
}
